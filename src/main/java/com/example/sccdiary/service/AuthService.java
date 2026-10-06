package com.example.sccdiary.service;

import com.example.sccdiary.dto.*;
import com.example.sccdiary.entity.RefreshToken;
import com.example.sccdiary.entity.User;
import com.example.sccdiary.exception.EmailAlreadyExistsException;
import com.example.sccdiary.exception.InvalidCredentialsException;
import com.example.sccdiary.exception.UnauthorizedToken;
import com.example.sccdiary.exception.UserNotFoundException;
import com.example.sccdiary.repository.RefreshTokenRepository;
import com.example.sccdiary.repository.UserRepository;
import com.example.sccdiary.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public SignupResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()))
                .name(request.getName())
                .build();

        User savedUser = userRepository.save(user);

        return new SignupResponse(
                true,
                "회원가입이 성공적으로 완료되었습니다.",
                new SignupResponse.Data(savedUser.getId(), savedUser.getEmail())
        );
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("이메일 또는 비밀번호가 일치하지 않습니다"));

        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("이메일 또는 비밀번호가 일치하지 않습니다");
        }

        String accessToken = jwtProvider.createAccessToken(user.getEmail());
        String refreshToken = jwtProvider.createRefreshToken(user.getEmail());

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .build();

        refreshTokenRepository.save(refreshTokenEntity);


        return new LoginResponse(
                true,
                "로그인에 성공하였습니다.",
                new LoginResponse.Data(accessToken,
                        refreshToken,
                        "Beater",
                        3600L)
        );
    }

    public LogoutResponse logout(LogoutRequest request) {

        RefreshToken refreshTokenEntity = refreshTokenRepository.findByRefreshToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedToken("유효하지 않은 토큰입니다"));

        refreshTokenRepository.delete(refreshTokenEntity);

        return new LogoutResponse(
                true,
                "로그아웃이 성공적으로 완료되었습니다.",
                null);
    }

    public MyInfoResponse myinfo(String token) {

        RefreshToken refreshTokenEntity = refreshTokenRepository.findByRefreshToken(token)
                .orElseThrow(() -> new UnauthorizedToken("유효하지 않은 토큰입니다"));

        User savedUser = userRepository.findByEmail(refreshTokenEntity.getEmail())
                .orElseThrow(() -> new UserNotFoundException("해당 사용자를 찾을 수 없습니다"));

        return new MyInfoResponse(
                true,
                "내 정보 조회가 성공적으로 완료되었습니다.",
                new MyInfoResponse.Data(
                        savedUser.getId(),
                        savedUser.getEmail(),
                        savedUser.getName(),
                        new String[]{},
                        new String[]{},
                        new String[]{}
                ) //아직 방, 일기, tmi는 구현하지 않아 임시 값 넣음
        );
    }
}


package com.example.sccdiary.service;

import com.example.sccdiary.dto.*;
import com.example.sccdiary.entity.Tmi;
import com.example.sccdiary.entity.User;
import com.example.sccdiary.exception.RoomNotFoundException;
import com.example.sccdiary.exception.TmiNotFoundException;
import com.example.sccdiary.exception.UnauthorizedToken;
import com.example.sccdiary.exception.UserNotFoundException;
import com.example.sccdiary.repository.RoomMemberRepository;
import com.example.sccdiary.repository.RoomRepository;
import com.example.sccdiary.repository.TmiRepository;
import com.example.sccdiary.repository.UserRepository;
import com.example.sccdiary.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TmiService {

    private final TmiRepository tmiRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final JwtProvider jwtProvider;

    @Transactional
    public TmiResponse createTmi(String token, TmiRequest request) {
        if (!jwtProvider.validateToken(token)) {
            throw new UnauthorizedToken("유효하지 않은 토큰입니다");
        }

        String email = jwtProvider.getEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("해당 사용자를 찾을 수 없습니다"));

        Tmi tmi = Tmi.builder()
                .content(request.getContent())
                .isFake(request.getIsFake())
                .user(user)
                .build();

        Tmi savedTmi = tmiRepository.save(tmi);

        return new TmiResponse(
                true,
                "tmi 작성 성공",
                new TmiResponse.TmiData(
                        savedTmi.getId(),
                        savedTmi.getContent(),
                        savedTmi.getIsFake()
                )
        );
    }

    /**
     * 방 멤버들의 TMI 목록 조회
     */
    @Transactional(readOnly = true)
    public TmiReadResponse getRoomMemberTmis(String token, Long roomId) {
        // 1. 토큰 유효성 검증
        if (!jwtProvider.validateToken(token)) {
            throw new UnauthorizedToken("유효하지 않은 토큰입니다.");
        }

        // 2. 토큰에서 유저 정보 추출
        String email = jwtProvider.getEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("해당 사용자를 찾을 수 없습니다."));

        // 3. 방 존재 여부 검증 (404)
        if (!roomRepository.existsById(roomId)) {
            throw new RoomNotFoundException("해당 방을 찾을 수 없습니다.");
        }

        // 4. 요청 유저가 해당 방의 멤버인지 권한 검증 (선택적 예외 처리)
        boolean isMember = roomMemberRepository.existsByRoomIdAndUserId(roomId, user.getId());
        if (!isMember) {
            throw new IllegalArgumentException("해당 방의 접근 권한이 없습니다.");
        }

        // 5. 방 멤버들의 TMI 목록 조회 (JPQL 쿼리 실행)
        List<Tmi> tmis = tmiRepository.findAllByRoomIdOrderByIdDesc(roomId);

        // 6. DTO 변환 및 반환
        List<TmiReadResponse.TmiElement> tmiElements = tmis.stream()
                .map(tmi -> new TmiReadResponse.TmiElement(
                        tmi.getId(),
                        tmi.getContent(),
                        tmi.getIsFake()
                ))
                .toList();

        return new TmiReadResponse(

                true,
                "tmi 작성 성공", // API 명세서 example 문구에 맞춤
                new TmiReadResponse.TmiData(tmiElements)
        );
    }

    public TmiGuessResponse guessTmiAuthor(String token, Long tmiId, TmiGuessRequest request) {
        if (!jwtProvider.validateToken(token)) {
            throw new UnauthorizedToken("유효하지 않은 토큰입니다.");
        }

        String email = jwtProvider.getEmail(token);
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("해당 사용자를 찾을 수 없습니다."));

        Tmi tmi = tmiRepository.findById(tmiId)
                .orElseThrow(() -> new TmiNotFoundException("해당 TMI을 찾을 수 없습니다."));

        User actualAuthor = tmi.getUser();
        boolean isCorrect = actualAuthor.getId().equals(request.getGuessedUserId());

        if (isCorrect) {
            currentUser.addScore(10);
        }

        return new TmiGuessResponse(
                true,
                "채점 완료",
                new TmiGuessResponse.GuessData(
                        isCorrect,
                        actualAuthor.getName(), // 사용자의 이름 필드getter 호출
                        currentUser.getScore()
                )
        );
    }
}

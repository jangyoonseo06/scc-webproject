package com.example.sccdiary.service;

import com.example.sccdiary.dto.*;
import com.example.sccdiary.entity.Tmi;
import com.example.sccdiary.entity.TmiGuess;
import com.example.sccdiary.entity.User;
import com.example.sccdiary.exception.RoomNotFoundException;
import com.example.sccdiary.exception.TmiNotFoundException;
import com.example.sccdiary.exception.UnauthorizedToken;
import com.example.sccdiary.exception.UserNotFoundException;
import com.example.sccdiary.repository.*;
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
    private final TmiGuessRepository tmiGuessRepository; // 통계 집계용 레포지토리 추가
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

        // 4. 요청 유저가 해당 방의 멤버인지 권한 검증
        boolean isMember = roomMemberRepository.existsByRoomIdAndUserId(roomId, user.getId());
        if (!isMember) {
            throw new IllegalArgumentException("해당 방의 접근 권한이 없습니다.");
        }

        // 5. 방 멤버들의 TMI 목록 조회
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
                "tmi 작성 성공",
                new TmiReadResponse.TmiData(tmiElements)
        );
    }

    /**
     * TMI 작성자 추리 제출 및 채점 (수정: @Transactional 적용 & TmiGuess 기록 저장)
     */
    @Transactional
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

        // 점수 갱신 (더티 체킹 반영을 위해 @Transactional 필요)
        if (isCorrect) {
            currentUser.addScore(10);
        }

        // 통계 집계를 위한 추리 이력 저장
        TmiGuess tmiGuess = TmiGuess.builder()
                .user(currentUser)
                .tmi(tmi)
                .guessedUserId(request.getGuessedUserId())
                .isCorrect(isCorrect)
                .build();
        tmiGuessRepository.save(tmiGuess);

        return new TmiGuessResponse(
                true,
                "채점 완료",
                new TmiGuessResponse.GuessData(
                        isCorrect,
                        actualAuthor.getName(),
                        currentUser.getScore()
                )
        );
    }

    /**
     * 사용자별 TMI 통계 조회 (신규 추가: GET /v1/tmi/statistics)
     */
    @Transactional(readOnly = true)
    public TmiStatisticsResponse getTmiStatistics(String token) {
        // 1. 토큰 유효성 검증
        if (!jwtProvider.validateToken(token)) {
            throw new UnauthorizedToken("유효하지 않은 토큰입니다.");
        }

        // 2. 유저 정보 추출
        String email = jwtProvider.getEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("해당 사용자를 찾을 수 없습니다."));

        // 3. 전체 추리 이력 조회
        long totalGuesses = tmiGuessRepository.countByUserId(user.getId());

        if (totalGuesses == 0) {
            return new TmiStatisticsResponse(
                    true,
                    "통계 조회 성공",
                    new TmiStatisticsResponse.StatisticsData(0, 0, 0)
            );
        }

        // 4. 비율 계산 (정답률, 친구 TMI 맞힌 비율, 거짓말 탐지 성공률)
        long correctCount = tmiGuessRepository.countByUserIdAndIsCorrectTrue(user.getId());
        int correctRate = (int) Math.round(((double) correctCount / totalGuesses) * 100);
        int guessRate = correctRate; // 특정 멤버 대상 집계 시 해당 조회 조건 반영 가능

        long totalFakeGuesses = tmiGuessRepository.countFakeTmiGuessesByUserId(user.getId());
        long correctFakeGuesses = tmiGuessRepository.countCorrectFakeTmiGuessesByUserId(user.getId());
        int successRate = totalFakeGuesses == 0 ? 0 : (int) Math.round(((double) correctFakeGuesses / totalFakeGuesses) * 100);

        return new TmiStatisticsResponse(
                true,
                "통계 조회 성공",
                new TmiStatisticsResponse.StatisticsData(correctRate, guessRate, successRate)
        );
    }
}

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

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
        if (!jwtProvider.validateToken(token)) {
            throw new UnauthorizedToken("유효하지 않은 토큰입니다.");
        }

        String email = jwtProvider.getEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("해당 사용자를 찾을 수 없습니다."));

        if (!roomRepository.existsById(roomId)) {
            throw new RoomNotFoundException("해당 방을 찾을 수 없습니다.");
        }

        boolean isMember = roomMemberRepository.existsByRoomIdAndUserId(roomId, user.getId());
        if (!isMember) {
            throw new IllegalArgumentException("해당 방의 접근 권한이 없습니다.");
        }

        List<Tmi> tmis = tmiRepository.findAllByRoomIdOrderByIdDesc(roomId);

        Set<Long> guessedIds = new HashSet<>(tmiGuessRepository.findGuessedTmiIdsByUserId(user.getId()));

        List<TmiReadResponse.TmiElement> tmiElements = tmis.stream()
                .map(tmi -> new TmiReadResponse.TmiElement(
                        tmi.getId(),
                        tmi.getContent(),
                        tmi.getUser().getId().equals(user.getId()),
                        guessedIds.contains(tmi.getId())))
                .toList();

        return new TmiReadResponse(
                true,
                "tmi 목록 조회 성공",
                new TmiReadResponse.TmiData(tmiElements)
        );
    }

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

        if (actualAuthor.getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("본인이 작성한 TMI에는 투표할 수 없습니다.");
        }
        if (!roomMemberRepository.existsSharedRoom(currentUser.getId(), actualAuthor.getId())) {
            throw new IllegalArgumentException("같은 방의 멤버가 작성한 TMI만 투표할 수 있습니다.");
        }
        if (tmiGuessRepository.existsByUserIdAndTmiId(currentUser.getId(), tmiId)) {
            throw new IllegalArgumentException("이미 투표한 TMI입니다.");
        }

        boolean isCorrect = actualAuthor.getId().equals(request.getGuessedUserId());
        if (isCorrect) {
            currentUser.addScore(10);
        }

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

    @Transactional(readOnly = true)
    public TmiStatisticsResponse getTmiStatistics(String token) {
        if (!jwtProvider.validateToken(token)) {
            throw new UnauthorizedToken("유효하지 않은 토큰입니다.");
        }

        String email = jwtProvider.getEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("해당 사용자를 찾을 수 없습니다."));

        long totalGuesses = tmiGuessRepository.countByUserId(user.getId());
        long correctCount = totalGuesses == 0
                ? 0 : tmiGuessRepository.countByUserIdAndIsCorrectTrue(user.getId());
        int correctRate = totalGuesses == 0
                ? 0 : (int) Math.round(((double) correctCount / totalGuesses) * 100);

        return new TmiStatisticsResponse(
                true,
                "통계 조회 성공",
                new TmiStatisticsResponse.StatisticsData(correctRate, correctCount, totalGuesses)
        );
    }
}

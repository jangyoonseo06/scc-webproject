package com.example.sccdiary.service;

import com.example.sccdiary.dto.DiaryReadResponse;
import com.example.sccdiary.dto.DiaryRequest;
import com.example.sccdiary.dto.YesterdayDiaryResponse;
import com.example.sccdiary.entity.Diary;
import com.example.sccdiary.entity.User;
import com.example.sccdiary.exception.DiaryNotFoundException;
import com.example.sccdiary.exception.DiaryNotOpenException;
import com.example.sccdiary.exception.RoomNotFoundException;
import com.example.sccdiary.repository.DiaryRepository;
import com.example.sccdiary.repository.RoomMemberRepository;
import com.example.sccdiary.repository.RoomRepository;
import com.example.sccdiary.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DiaryService {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;

    public DiaryService(DiaryRepository diaryRepository,
                        UserRepository userRepository,
                        RoomRepository roomRepository,
                        RoomMemberRepository roomMemberRepository) {
        this.diaryRepository = diaryRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.roomMemberRepository = roomMemberRepository;
    }

    @Transactional
    public Diary createDiary(Long userId, DiaryRequest request) {
        Diary diary = new Diary();
        diary.setUserId(userId);
        diary.setContent(request.getContent());
        diary.setMood(request.getEmotion());
        diary.setQuestion(request.getQuestionToFriend());
        diary.setDiaryDate(request.getDate());
        diary.setCreatedAt(LocalDateTime.now(KST));
        diary.setTemporary(request.getIsTemporary());
        return diaryRepository.save(diary);
    }

    @Transactional(readOnly = true)
    public DiaryReadResponse getDiary(Long diaryId, Long viewerId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new DiaryNotFoundException("해당 일기를 찾을 수 없습니다."));

        boolean isAuthor = diary.getUserId().equals(viewerId);

        if (!isAuthor) {
            if (!roomMemberRepository.existsSharedRoom(viewerId, diary.getUserId())) {
                throw new DiaryNotFoundException("해당 일기를 찾을 수 없습니다.");
            }
            LocalDate today = LocalDate.now(KST);
            if (diary.isTemporary() || !diary.getDiaryDate().isBefore(today)) {
                throw new DiaryNotOpenException("아직 열리지 않은 일기입니다. 내일 확인해주세요.");
            }
        }

        String authorName = userRepository.findById(diary.getUserId())
                .map(User::getName)
                .orElse("알 수 없음");

        return new DiaryReadResponse(
                true,
                "일기 조회 성공",
                new DiaryReadResponse.Data(
                        diary.getDiaryId(),
                        diary.getDiaryDate().toString(),
                        diary.getContent(),
                        diary.getQuestion(),
                        diary.getMood(),
                        authorName));
    }

    @Transactional
    public Diary updateDiary(Long diaryId, Long userId,
                             String content, String mood, String question) {
        Diary diary = findOwnedDiary(diaryId, userId, "수정");
        diary.setContent(content);
        diary.setMood(mood);
        diary.setQuestion(question);
        return diary;   // 더티 체킹으로 저장됨
    }

    @Transactional
    public void deleteDiary(Long diaryId, Long userId) {
        Diary diary = findOwnedDiary(diaryId, userId, "삭제");
        diaryRepository.delete(diary);
    }

    @Transactional(readOnly = true)
    public YesterdayDiaryResponse getYesterdayDiaries(Long roomId, Long userId) {
        if (!roomRepository.existsById(roomId)) {
            throw new RoomNotFoundException("해당 방을 찾을 수 없습니다.");
        }
        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new IllegalArgumentException("해당 방의 접근 권한이 없습니다.");
        }

        LocalDate yesterday = LocalDate.now(KST).minusDays(1);
        List<Diary> diaries = diaryRepository.findPublishedByRoomAndDate(roomId, yesterday);

        Map<Long, String> names = userRepository
                .findAllById(diaries.stream().map(Diary::getUserId).distinct().toList())
                .stream()
                .collect(Collectors.toMap(User::getId, User::getName));

        List<YesterdayDiaryResponse.Item> items = diaries.stream()
                .map(d -> new YesterdayDiaryResponse.Item(
                        d.getDiaryId(),
                        d.getDiaryDate().toString(),
                        d.getContent(),
                        d.getMood(),
                        names.getOrDefault(d.getUserId(), "알 수 없음")))
                .toList();

        return new YesterdayDiaryResponse(
                true,
                "어제의 일기 조회 성공",
                new YesterdayDiaryResponse.Data(items));
    }

    private Diary findOwnedDiary(Long diaryId, Long userId, String action) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new DiaryNotFoundException("해당 일기를 찾을 수 없습니다."));
        if (!diary.getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인이 작성한 일기만 " + action + "할 수 있습니다.");
        }
        return diary;
    }
}

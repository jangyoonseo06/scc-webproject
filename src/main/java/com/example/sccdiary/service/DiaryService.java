package com.example.sccdiary.service;

import com.example.sccdiary.entity.Diary;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.example.sccdiary.repository.DiaryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DiaryService {

    private final DiaryRepository diaryRepository;

    public DiaryService(DiaryRepository diaryRepository) {
        this.diaryRepository = diaryRepository;
    }


    // 일기 작성 및 임시저장
    public Diary createDiary(
            Long roomId,
            Long userId,
            String content,
            String mood,
            String question,
            LocalDate diaryDate,
            boolean isTemporary) {

        Diary diary = new Diary();

        diary.setRoomId(roomId);
        diary.setUserId(userId);
        diary.setContent(content);
        diary.setMood(mood);
        diary.setQuestion(question);
        diary.setDiaryDate(diaryDate);
        diary.setCreatedAt(LocalDateTime.now());
        diary.setTemporary(isTemporary);

        return diaryRepository.save(diary);
    }
    public Diary getDiary(Long diaryId) {
        // 1. DB에서 일기 조회
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("일기를 찾을 수 없습니다."));

        // 2. 임시 저장 상태 체크
        if (diary.isTemporary()) {
            throw new IllegalStateException("임시 저장된 일기는 아직 공개되지 않습니다.");
        }

        // 3. 다음 날 공개 조건 체크 (getDate() -> getDiaryDate() 로 수정)
        LocalDate diaryDate = diary.getDiaryDate();
        LocalDate today = LocalDate.now();

        // 작성일이 오늘이거나 미래인 경우 조회 불가 (어제 이전 일기만 공개)
        if (!diaryDate.isBefore(today)) {
            throw new IllegalStateException("이 일기는 작성 다음 날부터 공개됩니다.");
        }

        return diary;
    }
    public Diary updateDiary(
            Long diaryId,
            String content,
            String mood,
            String question
    ) {
        // 1. 수정할 일기 찾기
        Diary diary = getDiary(diaryId);

        // 2. 일기 내용 변경
        diary.setContent(content);
        diary.setMood(mood);
        diary.setQuestion(question);

        // 3. 변경된 일기 저장
        return diaryRepository.save(diary);
    }
    public void deleteDiary(Long diaryId) {

        Diary diary = getDiary(diaryId);

        diaryRepository.delete(diary);
    }
    public boolean canViewDiary(Diary diary, Long viewerId) {

        // 본인이 작성한 일기는 조회 가능
        if (diary.getUserId().equals(viewerId)) {
            return true;
        }

        // 임시저장 일기는 친구에게 공개하지 않음
        if (diary.isTemporary()) {
            return false;
        }

        // 다른 사람의 일기는 작성 날짜 다음 날부터 공개
        return diary.getDiaryDate().isBefore(LocalDate.now());
    }
    public List<Diary> getYesterdayDiaries(Long roomId) {
        // 1. 어제 날짜 계산
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // 2. 어제 작성되고 임시 저장이 아닌 일기 목록만 조회
        return diaryRepository.findByRoomIdAndDiaryDateAndIsTemporaryFalse(roomId, yesterday);
    }


}

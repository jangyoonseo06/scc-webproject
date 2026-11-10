package com.example.sccdiary.service;

import com.example.sccdiary.entity.Diary;
import com.example.sccdiary.repository.DiaryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiaryService {

    private final DiaryRepository diaryRepository;

    public DiaryService(DiaryRepository diaryRepository) {
        this.diaryRepository = diaryRepository;
    }

    // 1. 일기 작성 및 임시저장
    @Transactional
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

    // 2. 일기 단건 조회 (다음 날 공개 검증 포함)
    @Transactional(readOnly = true)
    public Diary getDiary(Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("일기를 찾을 수 없습니다."));

        if (diary.isTemporary()) {
            throw new IllegalStateException("임시 저장된 일기는 아직 공개되지 않습니다.");
        }

        LocalDate diaryDate = diary.getDiaryDate();
        LocalDate today = LocalDate.now();

        if (!diaryDate.isBefore(today)) {
            throw new IllegalStateException("이 일기는 작성 다음 날부터 공개됩니다.");
        }

        return diary;
    }

    // 3. 일기 수정 (getDiary()가 아닌 findById() 직접 사용)
    @Transactional
    public Diary updateDiary(
            Long diaryId,
            String content,
            String mood,
            String question
    ) {
        // 💡 수정할 때는 공개 조건 검증 없이 DB에서 바로 조회
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("일기를 찾을 수 없습니다."));

        diary.setContent(content);
        diary.setMood(mood);
        diary.setQuestion(question);

        return diaryRepository.save(diary);
    }

    // 4. 일기 삭제 (getDiary()가 아닌 findById() 직접 사용)
    @Transactional
    public void deleteDiary(Long diaryId) {
        // 💡 삭제할 때도 공개 조건 검증 없이 DB에서 바로 조회 후 삭제
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("일기를 찾을 수 없습니다."));

        diaryRepository.delete(diary);
    }

    // 5. 어제의 우리 조회
    @Transactional(readOnly = true)
    public List<Diary> getYesterdayDiaries(Long roomId) {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        return diaryRepository.findByRoomIdAndDiaryDateAndIsTemporaryFalse(roomId, yesterday);
    }
}

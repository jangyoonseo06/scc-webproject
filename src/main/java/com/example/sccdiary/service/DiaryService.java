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


    // ?쇨린 ?묒꽦 諛??꾩떆???
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
        return diaryRepository.findById(diaryId)
                .orElseThrow(() ->
                        new IllegalArgumentException("?쇨린瑜?李얠쓣 ???놁뒿?덈떎.")
                );
    }
    public Diary updateDiary(
            Long diaryId,
            String content,
            String mood,
            String question
    ) {
        // 1. ?섏젙???쇨린 李얘린
        Diary diary = getDiary(diaryId);

        // 2. ?쇨린 ?댁슜 蹂寃?
        diary.setContent(content);
        diary.setMood(mood);
        diary.setQuestion(question);

        // 3. 蹂寃쎈맂 ?쇨린 ???
        return diaryRepository.save(diary);
    }
    public void deleteDiary(Long diaryId) {

        Diary diary = getDiary(diaryId);

        diaryRepository.delete(diary);
    }
    public boolean canViewDiary(Diary diary, Long viewerId) {

        // 蹂몄씤???묒꽦???쇨린??議고쉶 媛??
        if (diary.getUserId().equals(viewerId)) {
            return true;
        }

        // ?꾩떆????쇨린??移쒓뎄?먭쾶 怨듦컻?섏? ?딆쓬
        if (diary.isTemporary()) {
            return false;
        }

        // ?ㅻⅨ ?щ엺???쇨린???묒꽦 ?좎쭨 ?ㅼ쓬 ?좊???怨듦컻
        return diary.getDiaryDate().isBefore(LocalDate.now());
    }
    public List<Diary> getYesterdayDiaries(Long roomId) {

        // ?ㅻ뒛 ?좎쭨?먯꽌 ?섎（ 鍮쇨린
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // ?대떦 諛⑹뿉???댁젣 ?묒꽦???쇨린 議고쉶
        return diaryRepository.findByRoomIdAndDiaryDateAndIsTemporaryFalse(
                roomId,
                yesterday
        );
    }


    public List<Diary> getMyDiaries(Long userId) {
        return diaryRepository.findByUserIdOrderByDiaryDateDesc(userId);
    }
}

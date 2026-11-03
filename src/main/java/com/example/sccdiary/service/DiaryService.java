package me.shinsunyoung.springbootdeveloper.service;



import me.shinsunyoung.springbootdeveloper.entity.Diary;
import java.time.LocalDate;
import java.time.LocalDateTime;
import me.shinsunyoung.springbootdeveloper.repository.DiaryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDate;

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
        return diaryRepository.findById(diaryId)
                .orElseThrow(() ->
                        new IllegalArgumentException("일기를 찾을 수 없습니다.")
                );
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

        // 오늘 날짜에서 하루 빼기
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // 해당 방에서 어제 작성한 일기 조회
        return diaryRepository.findByRoomIdAndDiaryDateAndIsTemporaryFalse(
                roomId,
                yesterday
        );
    }


}

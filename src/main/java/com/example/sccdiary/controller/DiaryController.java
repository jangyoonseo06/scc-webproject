package me.shinsunyoung.springbootdeveloper.controller;

import me.shinsunyoung.springbootdeveloper.dto.DiaryRequest;
import me.shinsunyoung.springbootdeveloper.entity.Diary;
import me.shinsunyoung.springbootdeveloper.service.DiaryService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/diaries")
public class DiaryController {

    private final DiaryService diaryService;

    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }

    @PostMapping("/write")
    public ResponseEntity<?> writeDiary(@RequestBody DiaryRequest request) {

        Diary diary = diaryService.createDiary(
                request.getRoomId(),
                request.getUserId(),
                request.getContent(),
                request.getEmotion(),
                request.getQuestionToFriend(),
                request.getDate(),
                request.isTemporary()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "success", true,
                        "message", "일기 작성 성공",
                        "data", Map.of("diaryId", diary.getDiaryId())
                )
        );
    }

    @PutMapping("/{diaryId}")
    public ResponseEntity<?> updateDiary(
            @PathVariable Long diaryId,
            @RequestBody DiaryRequest request
    ) {
        Diary diary = diaryService.updateDiary(
                diaryId,
                request.getContent(),
                request.getEmotion(),
                request.getQuestionToFriend()
        );

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "일기 수정 성공",
                        "data", Map.of("diaryId", diary.getDiaryId())
                )
        );
    }
    @GetMapping("/{diaryId}")
    public ResponseEntity<?> getDiary(
            @PathVariable Long diaryId,
            @RequestParam Long viewerId
    ) {
        Diary diary = diaryService.getDiary(diaryId);

        // 일기 공개 여부 확인
        if (!diaryService.canViewDiary(diary, viewerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of(
                            "success", false,
                            "message", "이 일기는 다음 날부터 공개됩니다."
                    )
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "일기 조회 성공",
                        "data", diary
                )
        );
    }
    @GetMapping("/yesterday")
    public ResponseEntity<?> getYesterdayDiaries(
            @RequestParam Long roomId
    ) {
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "어제의 우리 조회 성공",
                        "data", diaryService.getYesterdayDiaries(roomId)
                )
        );
    }
    @DeleteMapping("/{diaryId}")
    public ResponseEntity<?> deleteDiary(@PathVariable Long diaryId) {

        diaryService.deleteDiary(diaryId);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "일기 삭제 성공"
                )
        );
    }
}
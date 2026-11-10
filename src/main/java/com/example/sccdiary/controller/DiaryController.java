package com.example.sccdiary.controller;

import com.example.sccdiary.dto.DiaryRequest;
import com.example.sccdiary.entity.Diary;
import com.example.sccdiary.service.DiaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/v1/diaries")
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
    public ResponseEntity<?> getDiary(@PathVariable Long diaryId) {
        // Service 내부에서 일기 존재 여부 및 다음 날 공개 조건 검증이 함께 진행됩니다.
        Diary diary = diaryService.getDiary(diaryId);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "일기 조회 성공",
                        "data", diary
                )
        );
    }
    // 특정 방(room) 기준 어제의 우리 조회 API
    @GetMapping("/rooms/{roomId}/yesterday") // 전체 경로: /v1/diaries/rooms/{roomId}/yesterday
    public ResponseEntity<?> getYesterdayDiaries(@PathVariable Long roomId) {
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
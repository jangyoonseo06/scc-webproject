package com.example.sccdiary.controller;

import com.example.sccdiary.dto.DiaryRequest;
import com.example.sccdiary.entity.Diary;
import com.example.sccdiary.service.AuthService;
import com.example.sccdiary.service.DiaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/diaries")
public class DiaryController {

    private final DiaryService diaryService;
    private final AuthService authService; // 💡 AuthService 주입

    public DiaryController(DiaryService diaryService, AuthService authService) {
        this.diaryService = diaryService;
        this.authService = authService;
    }

    // 일기 작성 API
    @PostMapping("/write")
    public ResponseEntity<?> writeDiary(
            @RequestHeader("Authorization") String token,  // 💡 Bearer 토큰 수신
            @RequestParam("roomId") Long roomId,           // 💡 URL 쿼리 파라미터로 roomId 수신
            @RequestBody DiaryRequest request
    ) {
        // 1. 토큰에서 userId 추출
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = authService.getUserIdFromToken(token);

        // 2. 일기 생성 서비스 호출
        Diary diary = diaryService.createDiary(
                roomId,
                userId,
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

    // 일기 수정 API
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

    // 일기 단건 조회 API
    @GetMapping("/{diaryId}")
    public ResponseEntity<?> getDiary(@PathVariable Long diaryId) {
        Diary diary = diaryService.getDiary(diaryId);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "일기 조회 성공",
                        "data", diary
                )
        );
    }

    // 일기 삭제 API
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
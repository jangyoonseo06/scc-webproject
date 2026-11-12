package com.example.sccdiary.controller;

import com.example.sccdiary.dto.DiaryReadResponse;
import com.example.sccdiary.dto.DiaryRequest;
import com.example.sccdiary.dto.DiaryWriteResponse;
import com.example.sccdiary.dto.YesterdayDiaryResponse;
import com.example.sccdiary.entity.Diary;
import com.example.sccdiary.service.AuthService;
import com.example.sccdiary.service.DiaryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1")
public class DiaryController {

    private final DiaryService diaryService;
    private final AuthService authService;

    public DiaryController(DiaryService diaryService, AuthService authService) {
        this.diaryService = diaryService;
        this.authService = authService;
    }

    @PostMapping("/diaries/write")
    public ResponseEntity<DiaryWriteResponse> writeDiary(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody DiaryRequest request) {

        Long userId = authService.getUserIdFromToken(stripBearer(token));
        Diary diary = diaryService.createDiary(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new DiaryWriteResponse(true, "일기 작성 성공",
                        new DiaryWriteResponse.Data(diary.getDiaryId())));
    }

    @GetMapping("/diaries/{diaryId}")
    public ResponseEntity<DiaryReadResponse> getDiary(
            @RequestHeader("Authorization") String token,
            @PathVariable Long diaryId) {

        Long userId = authService.getUserIdFromToken(stripBearer(token));
        return ResponseEntity.ok(diaryService.getDiary(diaryId, userId));
    }

    @GetMapping("/rooms/{roomId}/diaries/yesterday")
    public ResponseEntity<YesterdayDiaryResponse> getYesterdayDiaries(
            @RequestHeader("Authorization") String token,
            @PathVariable Long roomId) {

        Long userId = authService.getUserIdFromToken(stripBearer(token));
        return ResponseEntity.ok(diaryService.getYesterdayDiaries(roomId, userId));
    }

    @PutMapping("/diaries/{diaryId}")
    public ResponseEntity<?> updateDiary(
            @RequestHeader("Authorization") String token,
            @PathVariable Long diaryId,
            @RequestBody DiaryRequest request) {

        Long userId = authService.getUserIdFromToken(stripBearer(token));
        Diary diary = diaryService.updateDiary(
                diaryId,
                userId,
                request.getContent(),
                request.getEmotion(),
                request.getQuestionToFriend());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "일기 수정 성공",
                "data", Map.of("diaryId", diary.getDiaryId())));
    }

    // 일기 삭제
    @DeleteMapping("/diaries/{diaryId}")
    public ResponseEntity<?> deleteDiary(
            @RequestHeader("Authorization") String token,
            @PathVariable Long diaryId) {

        Long userId = authService.getUserIdFromToken(stripBearer(token));
        diaryService.deleteDiary(diaryId, userId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "일기 삭제 성공"));
    }

    private String stripBearer(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return token;
    }
}
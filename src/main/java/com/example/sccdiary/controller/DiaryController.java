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
                        "message", "?쇨린 ?묒꽦 ?깃났",
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
                        "message", "?쇨린 ?섏젙 ?깃났",
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

        // ?쇨린 怨듦컻 ?щ? ?뺤씤
        if (!diaryService.canViewDiary(diary, viewerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of(
                            "success", false,
                            "message", "???쇨린???ㅼ쓬 ?좊???怨듦컻?⑸땲??"
                    )
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "?쇨린 議고쉶 ?깃났",
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
                        "message", "?댁젣???곕━ 議고쉶 ?깃났",
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
                        "message", "?쇨린 ??젣 ?깃났"
                )
        );
    }
    @GetMapping("/my")
    public ResponseEntity<?> getMyDiaries(@RequestParam Long userId) {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "내가 쓴 일기 조회 성공",
                "data", diaryService.getMyDiaries(userId)
        ));
    }
}

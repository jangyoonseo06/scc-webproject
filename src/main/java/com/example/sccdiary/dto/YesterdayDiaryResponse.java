package com.example.sccdiary.dto;

import java.util.List;

public record YesterdayDiaryResponse(boolean success, String message, Data data) {

    public record Data(List<Item> diaries) {
    }

    public record Item(Long diaryId,
                       String date,
                       String content,
                       String emotion,
                       String authorName) {
    }
}

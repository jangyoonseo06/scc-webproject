package com.example.sccdiary.dto;

public record DiaryWriteResponse(boolean success, String message, Data data) {

    public record Data(Long diaryId) {
    }
}

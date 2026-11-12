package com.example.sccdiary.dto;

public record DiaryReadResponse(boolean success, String message, Data data) {

    public record Data(Long diaryId,
                       String date,
                       String content,
                       String questionToFriend,
                       String emotion,
                       String authorName) {
    }
}
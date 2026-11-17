package com.example.sccdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MyDiaryListResponse {
    private boolean success;
    private String message;
    private Data data;

    @Getter
    @AllArgsConstructor
    public static class Data {
        private int totalCount;
        private List<Item> diaries;
    }

    @Getter
    @AllArgsConstructor
    public static class Item {
        private Long diaryId;
        private String date;
        private String content;
        private String questionToFriend;
        private String emotion;
        // 래퍼 Boolean + Lombok getIsTemporary() 이름이라 JSON 이름이 isTemporary로 나감
        private Boolean isTemporary;
    }
}
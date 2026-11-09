package com.example.sccdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyInfoResponse {
    private boolean success;
    private String message;
    private Data data;

    @Getter
    @AllArgsConstructor
    public static class Data {
        private Long userId;
        private String email;
        private String name;
        private String[] rooms;
        private String[] diaries;
        private String[] tmis;
    }
}

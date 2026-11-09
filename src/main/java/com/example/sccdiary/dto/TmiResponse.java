package com.example.sccdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TmiResponse {
    private boolean success;
    private String message;
    private TmiData data;

    @Getter
    @AllArgsConstructor
    public static class TmiData {
        private Long tmiId;
        private String content;
        private boolean isFake;
    }
}

package com.example.sccdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TmiGuessResponse {
    private boolean success;
    private String message;
    private GuessData data;

    @Getter
    @AllArgsConstructor
    public static class GuessData {
        private boolean isCorrect;
        private String actualAuthorName;
        private Integer accumulatedScore;
    }
}

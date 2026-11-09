package com.example.sccdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TmiStatisticsResponse {
    private boolean success;
    private String message;
    private StatisticsData data;

    @Getter
    @AllArgsConstructor
    public static class StatisticsData {
        private Integer correctRate;
        private Long correctCount;
        private Long totalGuesses;
    }
}

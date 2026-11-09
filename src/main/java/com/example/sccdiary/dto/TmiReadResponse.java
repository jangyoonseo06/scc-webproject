package com.example.sccdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class TmiReadResponse {
    private boolean success;
    private String message;
    private TmiData data;

    @Getter
    @AllArgsConstructor
    public static class TmiData {
        private List<TmiElement> tmis;
    }

    @Getter
    @AllArgsConstructor
    public static class TmiElement {
        private Long tmiId;
        private String content;
        private Boolean isMine;
        private Boolean hasGuessed;
    }
}

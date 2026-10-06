package com.example.sccdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LogoutResponse {
    private boolean success;
    private String message;
    private Data date;

    @Getter
    @AllArgsConstructor
    public static class Data {
        private Long nullable;
    }
}

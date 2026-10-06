package com.example.sccdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignupResponse {
    private boolean success;
    private String message;
    private Data data;

    @Getter
    @AllArgsConstructor
    public static class Data {
        private Long userID;
        private String email;
    }
}

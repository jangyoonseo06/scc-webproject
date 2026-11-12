package com.example.sccdiary.exception;

public class DiaryNotFoundException extends RuntimeException {
    public DiaryNotFoundException(String message) {
        super(message);
    }
}

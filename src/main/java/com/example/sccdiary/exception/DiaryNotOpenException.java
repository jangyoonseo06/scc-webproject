package com.example.sccdiary.exception;

public class DiaryNotOpenException extends RuntimeException {
    public DiaryNotOpenException(String message) {
        super(message);
    }
}

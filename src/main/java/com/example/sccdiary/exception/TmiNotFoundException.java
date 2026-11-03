package com.example.sccdiary.exception;

public class TmiNotFoundException extends RuntimeException{
    public TmiNotFoundException(String message) {
        super(message);
    }
}

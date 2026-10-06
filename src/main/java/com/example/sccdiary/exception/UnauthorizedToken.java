package com.example.sccdiary.exception;

public class UnauthorizedToken extends RuntimeException {
    public UnauthorizedToken(String message) {
        super(message);
    }
}

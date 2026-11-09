package com.example.sccdiary.dto;

public record InviteCodeResponse(boolean success, String message, Data data) {
    public record Data(String inviteCode) {}
}

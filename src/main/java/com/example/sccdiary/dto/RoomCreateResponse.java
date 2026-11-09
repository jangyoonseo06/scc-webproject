package com.example.sccdiary.dto;

// RoomCreateResponse.java
public record RoomCreateResponse(boolean success, String message, Data data) {
    public record Data(Long roomId, String roomName,
                       Integer roomMembersNumber, String inviteCode) {}
}

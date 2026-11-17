package com.example.sccdiary.dto;

import java.util.List;

public record MyRoomListResponse(boolean success, String message, Data data) {

    public record Data(List<Item> rooms) {
    }

    public record Item(Long roomId, String roomName, Integer roomMembersNumber) {
    }
}

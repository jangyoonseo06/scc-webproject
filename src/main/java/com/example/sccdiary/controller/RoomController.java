package com.example.sccdiary.controller;

import com.example.sccdiary.entity.Room;
import com.example.sccdiary.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // ë°?ë§Œë“¤ê¸?
    @PostMapping
    public ResponseEntity<Room> createRoom(
            @RequestBody CreateRoomRequest request) {

        Room room = roomService.createRoom(
                request.getRoomName(),
                request.getUserId()
        );

        return ResponseEntity.ok(room);
    }

    public static class CreateRoomRequest {

        private String roomName;
        private Long userId;

        public String getRoomName() {
            return roomName;
        }

        public void setRoomName(String roomName) {
            this.roomName = roomName;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }
}

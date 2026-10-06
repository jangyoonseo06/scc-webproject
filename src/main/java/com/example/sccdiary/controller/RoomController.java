package com.example.sccdiary.controller;

import com.example.sccdiary.entity.Room;
import com.example.sccdiary.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // Î∞?ÎßåÎì§Í∏?
    @PostMapping
    public ResponseEntity<Room> createRoom(
            @RequestBody CreateRoomRequest request) {

        Room room = roomService.createRoom(
                request.getRoomName(),
                request.getUserId()
        );

        return ResponseEntity.ok(room);
    }


    // =========================
    // Ï¥àÎ? ÏΩîÎìúÎ°?Î∞?Ï∞∏Ïó¨
    // =========================
    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> joinRoom(
            @RequestBody JoinRoomRequest request) {

        Room room = roomService.joinRoom(
                request.getInviteCode(),
                request.getUserId()
        );

        // ?ÑÎ°†?∏Ïóê ?ÑÎã¨??data
        Map<String, Object> data = new HashMap<>();
        data.put("roomId", room.getRoomId());
        data.put("roomName", room.getRoomName());

        // ÏµúÏ¢Ö ?ëÎãµ
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Î∞?Ï∞∏Ïó¨ ?±Í≥µ");
        response.put("data", data);

        return ResponseEntity.ok(response);
    }


    // Î∞??ùÏÑ± ?îÏ≤≠ DTO
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


    // Î∞?Ï∞∏Ïó¨ ?îÏ≤≠ DTO
    public static class JoinRoomRequest {

        private String inviteCode;
        private Long userId;

        public String getInviteCode() {
            return inviteCode;
        }

        public void setInviteCode(String inviteCode) {
            this.inviteCode = inviteCode;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }
}

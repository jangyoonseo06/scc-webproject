package com.example.sccdiary.controller;

import com.example.sccdiary.dto.InviteCodeResponse;
import com.example.sccdiary.dto.RoomCreateRequest;
import com.example.sccdiary.dto.RoomCreateResponse;
import com.example.sccdiary.entity.Room;
import com.example.sccdiary.entity.User;
import com.example.sccdiary.service.AuthService;
import com.example.sccdiary.service.DiaryService;
import com.example.sccdiary.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/rooms")
public class RoomController {

    private final RoomService roomService;
    private final AuthService authService;
    private final DiaryService diaryService;

    public RoomController(RoomService roomService, AuthService authService, DiaryService diaryService) {
        this.roomService = roomService;
        this.authService = authService;
        this.diaryService = diaryService;
    }

    @PostMapping("/create")
    public ResponseEntity<RoomCreateResponse> createRoom(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody RoomCreateRequest request) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = authService.getUserIdFromToken(token);

        Room room = roomService.createRoom(
                request.roomName(), request.roomMembersNumber(), userId);

        RoomCreateResponse response = new RoomCreateResponse(
                true,
                "방 생성 성공",
                new RoomCreateResponse.Data(
                        room.getRoomId(),
                        room.getRoomName(),
                        room.getMaxMembers(),
                        room.getInviteCode()));

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{roomId}/invite-code")
    public ResponseEntity<InviteCodeResponse> getInviteCode(
            @RequestHeader("Authorization") String token,
            @PathVariable Long roomId) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        Long userId = authService.getUserIdFromToken(token);

        String inviteCode = roomService.getInviteCode(roomId, userId);

        return ResponseEntity.ok(new InviteCodeResponse(
                true,
                "초대코드 조회 성공",
                new InviteCodeResponse.Data(inviteCode)));
    }

    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> joinRoom(
            @RequestHeader("Authorization") String token,
            @RequestBody JoinRoomRequest request) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = authService.getUserIdFromToken(token);

        Room room = roomService.joinRoom(request.getInviteCode(), userId);


        Map<String, Object> data = new HashMap<>();
        data.put("roomId", room.getRoomId());
        data.put("roomName", room.getRoomName());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "방 참여 성공");
        response.put("data", data);

        return ResponseEntity.ok(response);
    }

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

    @GetMapping("/{roomId}/members")
    public ResponseEntity<Map<String, Object>> getMembers(
            @RequestHeader("Authorization") String token,
            @PathVariable Long roomId) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = authService.getUserIdFromToken(token);

        List<Map<String, Object>> members = roomService.getMembers(roomId, userId).stream()
                .map(u -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("userId", u.getId());
                    m.put("name", u.getName());
                    return m;
                })
                .toList();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("members", members);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "방 멤버 목록 조회 성공");
        response.put("data", data);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyRooms(
            @RequestHeader("Authorization") String token) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long userId = authService.getUserIdFromToken(token);

        List<Map<String, Object>> rooms = roomService.getMyRooms(userId).stream()
                .map(r -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("roomId", r.getRoomId());
                    m.put("roomName", r.getRoomName());
                    m.put("roomMembersNumber", r.getMaxMembers());
                    return m;
                })
                .toList();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("rooms", rooms);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "내 방 목록 조회 성공");
        response.put("data", data);

        return ResponseEntity.ok(response);
    }
}

package com.example.sccdiary.service;

import com.example.sccdiary.entity.Room;
import com.example.sccdiary.entity.RoomMember;
import com.example.sccdiary.repository.RoomMemberRepository;
import com.example.sccdiary.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;

    public RoomService(RoomRepository roomRepository,
                       RoomMemberRepository roomMemberRepository) {
        this.roomRepository = roomRepository;
        this.roomMemberRepository = roomMemberRepository;
    }

    // Î∞?ÎßåÎì§Í∏?
    public Room createRoom(String roomName, Long userId) {

        // 1. 6?êÎ¶¨ Ï¥àÎ? ÏΩîÎìú ?ùÏÑ±
        String inviteCode = createInviteCode();

        // 2. Î∞?Í∞ùÏ≤¥ ?ùÏÑ±
        Room room = new Room();
        room.setRoomName(roomName);
        room.setInviteCode(inviteCode);
        room.setCreatedBy(userId);

        // 3. rooms ?åÏù¥Î∏îÏóê ?Ä??
        Room savedRoom = roomRepository.save(room);

        // 4. Î∞©ÏùÑ ÎßåÎì† ?¨Îûå??Î∞?Î©§Î≤ÑÎ°??±Î°ù
        RoomMember roomMember = new RoomMember();
        roomMember.setRoomId(savedRoom.getRoomId());
        roomMember.setUserId(userId);

        roomMemberRepository.save(roomMember);

        return savedRoom;
    }

    // 6?êÎ¶¨ Ï¥àÎ? ÏΩîÎìú ?ùÏÑ±
    private String createInviteCode() {
        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 6)
                .toUpperCase();
    }
}

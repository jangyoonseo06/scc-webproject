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


    public Room createRoom(String roomName, Long userId) {
        String inviteCode = createInviteCode();

        Room room = new Room();
        room.setRoomName(roomName);
        room.setInviteCode(inviteCode);
        room.setCreatedBy(userId);

        Room savedRoom = roomRepository.save(room);

        RoomMember roomMember = new RoomMember();
        roomMember.setRoomId(savedRoom.getRoomId());
        roomMember.setUserId(userId);

        roomMemberRepository.save(roomMember);

        return savedRoom;
    }

    public Room joinRoom(String inviteCode, Long userId) {

        Room room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() ->
                        new IllegalArgumentException("?�효?��? ?��? 초�? 코드?�니??"));

        Long roomId = room.getRoomId();

        if (roomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new IllegalArgumentException("?��? 참여??방입?�다.");
        }

        int currentMembers =
                roomMemberRepository.findByRoomId(roomId).size();

        if (currentMembers >= room.getMaxMembers()) {
            throw new IllegalArgumentException("�??�원??가??찼습?�다.");
        }

        RoomMember roomMember = new RoomMember();
        roomMember.setRoomId(roomId);
        roomMember.setUserId(userId);

        roomMemberRepository.save(roomMember);

        return room;
    }

    private String createInviteCode() {
        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 6)
                .toUpperCase();
    }
}

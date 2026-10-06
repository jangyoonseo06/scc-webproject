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

    // ë°?ë§Œë“¤ê¸?
    public Room createRoom(String roomName, Long userId) {

        // 1. 6?ë¦¬ ì´ˆë? ì½”ë“œ ?ì„±
        String inviteCode = createInviteCode();

        // 2. ë°?ê°ì²´ ?ì„±
        Room room = new Room();
        room.setRoomName(roomName);
        room.setInviteCode(inviteCode);
        room.setCreatedBy(userId);

        // 3. rooms ?Œì´ë¸”ì— ?€??
        Room savedRoom = roomRepository.save(room);

        // 4. ë°©ì„ ë§Œë“  ?¬ëŒ??ë°?ë©¤ë²„ë¡??±ë¡
        RoomMember roomMember = new RoomMember();
        roomMember.setRoomId(savedRoom.getRoomId());
        roomMember.setUserId(userId);

        roomMemberRepository.save(roomMember);

        return savedRoom;
    }


    // ???¬ê¸°ë¶€???ˆë¡œ ì¶”ê? ??
    // ì´ˆë? ì½”ë“œë¡?ë°?ì°¸ì—¬
    public Room joinRoom(String inviteCode, Long userId) {

        // 1. ì´ˆë? ì½”ë“œ???´ë‹¹?˜ëŠ” ë°?ì°¾ê¸°
        Room room = roomRepository.findByInviteCode(inviteCode)
                .orElseThrow(() ->
                        new IllegalArgumentException("? íš¨?˜ì? ?Šì? ì´ˆë? ì½”ë“œ?…ë‹ˆ??"));

        Long roomId = room.getRoomId();

        // 2. ?´ë? ì°¸ì—¬???¬ìš©?ì¸ì§€ ?•ì¸
        if (roomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new IllegalArgumentException("?´ë? ì°¸ì—¬??ë°©ì…?ˆë‹¤.");
        }

        // 3. ?„ì¬ ë°??¸ì› ?•ì¸
        int currentMembers =
                roomMemberRepository.findByRoomId(roomId).size();

        if (currentMembers >= room.getMaxMembers()) {
            throw new IllegalArgumentException("ë°??•ì›??ê°€??ì°¼ìŠµ?ˆë‹¤.");
        }

        // 4. room_members ?Œì´ë¸”ì— ?¬ìš©??ì¶”ê?
        RoomMember roomMember = new RoomMember();
        roomMember.setRoomId(roomId);
        roomMember.setUserId(userId);

        roomMemberRepository.save(roomMember);

        // 5. ì°¸ì—¬??ë°?ë°˜í™˜
        return room;
    }
    // ???¬ê¸°ê¹Œì? ?ˆë¡œ ì¶”ê? ??


    // 6?ë¦¬ ì´ˆë? ì½”ë“œ ?ì„±
    private String createInviteCode() {
        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 6)
                .toUpperCase();
    }
}

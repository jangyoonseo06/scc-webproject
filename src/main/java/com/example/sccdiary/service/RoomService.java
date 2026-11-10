package com.example.sccdiary.service;

import com.example.sccdiary.entity.Room;
import com.example.sccdiary.entity.RoomMember;
import com.example.sccdiary.entity.User;
import com.example.sccdiary.exception.RoomNotFoundException;
import com.example.sccdiary.repository.RoomMemberRepository;
import com.example.sccdiary.repository.RoomRepository;
import com.example.sccdiary.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final UserRepository userRepository;

    public RoomService(RoomRepository roomRepository,
                       RoomMemberRepository roomMemberRepository,
                       UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.roomMemberRepository = roomMemberRepository;
        this.userRepository = userRepository;
    }


    @Transactional
    public Room createRoom(String roomName, Integer maxMembers, Long userId) {
        Room room = new Room();
        room.setRoomName(roomName);
        room.setInviteCode(createInviteCode());
        room.setMaxMembers(maxMembers);
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
                        new IllegalArgumentException("유효하지 않은 초대 코드입니다."));

        Long roomId = room.getRoomId();

        if (roomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new IllegalArgumentException("이미 참여한 방입니다.");
        }

        int currentMembers =
                roomMemberRepository.findByRoomId(roomId).size();

        if (currentMembers >= room.getMaxMembers()) {
            throw new IllegalArgumentException("방 인원이 가득 찼습니다.");
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

    // RoomService
    public String getInviteCode(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("해당 방을 찾을 수 없습니다"));

        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new IllegalArgumentException("방 멤버만 조회할 수 있습니다");
        }
        return room.getInviteCode();
    }

    public List<User> getMembers(Long roomId, Long userId) {
        roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("해당 방을 찾을 수 없습니다"));

        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new IllegalArgumentException("방 멤버만 조회할 수 있습니다");
        }

        List<Long> userIds = roomMemberRepository.findByRoomId(roomId).stream()
                .map(RoomMember::getUserId)
                .toList();

        return userRepository.findAllById(userIds);
    }

    public List<Room> getMyRooms(Long userId) {
        return roomRepository.findAllByMemberUserId(userId);
    }
}

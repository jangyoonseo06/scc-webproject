package com.example.sccdiary.repository;

import com.example.sccdiary.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByInviteCode(String inviteCode);

    @Query("select r from Room r where r.roomId in "
            + "(select m.roomId from RoomMember m where m.userId = :userId) "
            + "order by r.roomId desc")
    List<Room> findAllByMemberUserId(@Param("userId") Long userId);
}

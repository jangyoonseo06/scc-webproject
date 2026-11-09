package com.example.sccdiary.repository;

import com.example.sccdiary.entity.Tmi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TmiRepository extends JpaRepository<Tmi, Long> {
    @Query("SELECT t FROM Tmi t WHERE t.user.id IN (SELECT rm.userId FROM RoomMember rm WHERE rm.roomId = :roomId) ORDER BY t.id DESC")
    List<Tmi> findAllByRoomIdOrderByIdDesc(@Param("roomId") Long roomId);
}
package com.example.sccdiary.repository;

import com.example.sccdiary.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    @Query("select d from Diary d "
            + "where d.diaryDate = :date and d.isTemporary = false "
            + "and d.userId in (select m.userId from RoomMember m where m.roomId = :roomId) "
            + "order by d.diaryId desc")
    List<Diary> findPublishedByRoomAndDate(@Param("roomId") Long roomId,
                                           @Param("date") LocalDate date);
}
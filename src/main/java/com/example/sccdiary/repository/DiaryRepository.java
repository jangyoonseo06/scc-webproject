package com.example.sccdiary.repository;

import com.example.sccdiary.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    List<Diary> findByRoomIdAndDiaryDateAndIsTemporaryFalse(
            Long roomId,
            LocalDate diaryDate
    );
}
package com.example.sccdiary.repository;

import com.example.sccdiary.entity.TmiGuess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TmiGuessRepository extends JpaRepository<TmiGuess, Long> {
    long countByUserId(Long userId);
    long countByUserIdAndIsCorrectTrue(Long userId);

    @Query("SELECT COUNT(g) FROM TmiGuess g WHERE g.user.id = :userId AND g.tmi.isFake = true")
    long countFakeTmiGuessesByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(g) FROM TmiGuess g WHERE g.user.id = :userId AND g.tmi.isFake = true AND g.isCorrect = true")
    long countCorrectFakeTmiGuessesByUserId(@Param("userId") Long userId);

    boolean existsByUserIdAndTmiId(Long userId, Long tmiId);

    @Query("SELECT g.tmi.id FROM TmiGuess g WHERE g.user.id = :userId")
    List<Long> findGuessedTmiIdsByUserId(@Param("userId") Long userId);
}

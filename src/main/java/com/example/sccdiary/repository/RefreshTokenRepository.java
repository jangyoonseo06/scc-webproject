package com.example.sccdiary.repository;

import com.example.sccdiary.entity.RefreshToken;
import com.example.sccdiary.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository <RefreshToken, Long> {
    Optional <RefreshToken> findByRefreshToken(String refreshToken);
}

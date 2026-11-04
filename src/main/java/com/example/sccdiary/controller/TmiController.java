package com.example.sccdiary.controller;

import com.example.sccdiary.dto.*;
import com.example.sccdiary.service.TmiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class TmiController {

    private final TmiService tmiService;

    @PostMapping("/tmi")
    public ResponseEntity <TmiResponse> createTmi(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TmiRequest request) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        TmiResponse response = tmiService.createTmi(token, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/rooms/{roomId}/tmi")
    public ResponseEntity<TmiReadResponse> getRoomMemberTmis(
            @RequestHeader("Authorization") String token,
            @PathVariable Long roomId) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        TmiReadResponse response = tmiService.getRoomMemberTmis(token, roomId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tmi/{tmiId}/guess")
    public ResponseEntity<TmiGuessResponse> guessTmiAuthor(
            @RequestHeader("Authorization") String token,
            @PathVariable Long tmiId,
            @Valid @RequestBody TmiGuessRequest request) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        TmiGuessResponse response = tmiService.guessTmiAuthor(token, tmiId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tmi/statistics")
    public ResponseEntity<TmiStatisticsResponse> getTmiStatistics(
            @RequestHeader("Authorization") String token) {

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        TmiStatisticsResponse response = tmiService.getTmiStatistics(token);
        return ResponseEntity.ok(response);
    }
}
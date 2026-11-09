package com.example.sccdiary.dto;

// RoomCreateRequest.java
import jakarta.validation.constraints.*;

public record RoomCreateRequest(
        @NotBlank @Size(min = 1, max = 10)
        String roomName,

        @NotNull @Min(1) @Max(10)
        Integer roomMembersNumber
) {}

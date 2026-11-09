package com.example.sccdiary.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TmiGuessRequest {
    @NotNull(message = "추리 대상 사용자 ID는 필수 입력값입니다.")
    private Long guessedUserId;
}

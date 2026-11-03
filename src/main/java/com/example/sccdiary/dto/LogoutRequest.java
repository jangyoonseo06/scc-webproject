package com.example.sccdiary.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest {

    @NotBlank(message = "refreshToken은 필수입니다.")
    private String refreshToken;
}

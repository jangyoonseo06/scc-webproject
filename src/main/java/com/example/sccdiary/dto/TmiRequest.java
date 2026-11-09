package com.example.sccdiary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TmiRequest {

    @NotBlank(message = "내용은 필수 입력값입니다.")
    @Size(min = 1, max = 1000, message = "내용은 1자 이상 1000자 이하여야 합니다.")
    private String content;

    @NotNull(message = "TMI의 진위 여부는 필수 입력값입니다.")
    private Boolean isFake;
}

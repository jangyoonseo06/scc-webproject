package com.example.sccdiary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class DiaryRequest {

    @NotBlank(message = "내용은 필수 입력값 입니다.")
    @Size(max = 2000, message = "내용은 2000자 이하여야 합니다.")
    private String content;

    @NotBlank(message = "친구에게 할 질문은 필수 입력값입니다.")
    @Size(max = 100, message = "질문은 100자 이하여야 합니다.")
    private String questionToFriend;

    @NotNull(message = "날짜는 필수 입력값입니다.")
    private LocalDate date;

    @NotBlank(message = "감정은 필수 입력값입니다.")
    @Pattern(regexp = "HAPPY|CALM|NORMAL|UPSET|TIRED|EXCITED",
            message = "올바르지 않은 감정 값입니다.")
    private String emotion;

    @NotNull(message = "임시저장 여부는 필수 입력값입니다.")
    private Boolean isTemporary;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getQuestionToFriend() {
        return questionToFriend;
    }

    public void setQuestionToFriend(String questionToFriend) {
        this.questionToFriend = questionToFriend;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }

    public Boolean getIsTemporary() {
        return isTemporary;
    }

    public void setIsTemporary(Boolean isTemporary) {
        this.isTemporary = isTemporary;
    }
}
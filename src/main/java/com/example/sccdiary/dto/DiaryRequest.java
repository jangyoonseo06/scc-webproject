package com.example.sccdiary.dto;

import lombok.Getter;

import java.time.LocalDate;

public class DiaryRequest {

    private Long roomId;
    private Long userId;
    private String content;
    private String questionToFriend;
    private LocalDate date;
    private String emotion;
    private boolean isTemporary;

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

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

    public boolean isTemporary() {
        return isTemporary;
    }

    public void setTemporary(boolean temporary) {
        isTemporary = temporary;
    }
}
package com.example.sccdiary;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String testApp() {
        return "SccDiaryApplication이 성공적으로 실행중입니다!";
    }
}
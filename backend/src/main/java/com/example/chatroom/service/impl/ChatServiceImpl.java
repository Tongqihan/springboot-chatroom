package com.example.chatroom.service.impl;

import com.example.chatroom.service.ChatService;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl implements ChatService {

    @Override
    public String getProjectStage() {
        return "skeleton";
    }
}

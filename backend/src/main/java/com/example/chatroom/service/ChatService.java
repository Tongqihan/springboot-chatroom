package com.example.chatroom.service;

import com.example.chatroom.dto.ChatMessageRequest;
import com.example.chatroom.dto.ChatMessageResponse;
import java.util.List;

public interface ChatService {

    ChatMessageResponse saveMessage(ChatMessageRequest request);

    List<ChatMessageResponse> getRecentMessages(int limit);
}

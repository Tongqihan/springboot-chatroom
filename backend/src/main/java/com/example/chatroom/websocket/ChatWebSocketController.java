package com.example.chatroom.websocket;

import com.example.chatroom.dto.ChatMessageRequest;
import com.example.chatroom.dto.ChatMessageResponse;
import com.example.chatroom.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * WebSocket 消息处理入口。
 */
@Controller
public class ChatWebSocketController {

    private static final String BROADCAST_DESTINATION = "/topic/messages";

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Valid @Payload ChatMessageRequest request) {
        ChatMessageResponse saved = chatService.saveMessage(request);
        messagingTemplate.convertAndSend(BROADCAST_DESTINATION, saved);
    }
}

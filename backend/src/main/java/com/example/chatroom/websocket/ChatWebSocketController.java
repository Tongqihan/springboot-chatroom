package com.example.chatroom.websocket;

import com.example.chatroom.dto.ChatMessageRequest;
import com.example.chatroom.dto.ChatMessageResponse;
import com.example.chatroom.dto.PresenceUpdateResponse;
import com.example.chatroom.dto.MessageType;
import com.example.chatroom.dto.UserPresenceRequest;
import com.example.chatroom.service.ChatService;
import com.example.chatroom.service.OnlineUserService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * WebSocket 消息处理入口。
 */
@Controller
public class ChatWebSocketController {

    static final String BROADCAST_DESTINATION = "/topic/messages";
    static final String PRESENCE_DESTINATION = "/topic/presence";

    private final ChatService chatService;
    private final OnlineUserService onlineUserService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(
            ChatService chatService,
            OnlineUserService onlineUserService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.chatService = chatService;
        this.onlineUserService = onlineUserService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Valid @Payload ChatMessageRequest request) {
        ChatMessageResponse saved = chatService.saveMessage(request);
        messagingTemplate.convertAndSend(BROADCAST_DESTINATION, saved);
    }

    @MessageMapping("/chat.join")
    public void onJoin(
            @Valid @Payload UserPresenceRequest request,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String username = request.username().trim();
        String sessionId = headerAccessor.getSessionId();
        PresenceUpdateResponse presence = onlineUserService.userJoined(sessionId, username);
        broadcastSystemMessage(username + " 加入了聊天室");
        broadcastPresence(presence);
    }

    @MessageMapping("/chat.leave")
    public void onLeave(
            @Valid @Payload UserPresenceRequest request,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String username = request.username().trim();
        String sessionId = headerAccessor.getSessionId();
        String onlineUsername = onlineUserService.getUsernameBySession(sessionId);
        PresenceUpdateResponse presence = onlineUserService.userLeftBySessionAndName(sessionId, username);
        String leaveUser = onlineUsername == null ? username : onlineUsername;
        if (onlineUsername != null) {
            broadcastSystemMessage(leaveUser + " 离开了聊天室");
        }
        broadcastPresence(presence);
    }

    void onDisconnected(String sessionId) {
        String leaveUser = onlineUserService.getUsernameBySession(sessionId);
        PresenceUpdateResponse presence = onlineUserService.userLeftBySession(sessionId);
        if (leaveUser != null) {
            broadcastSystemMessage(leaveUser + " 离开了聊天室");
        }
        broadcastPresence(presence);
    }

    private void broadcastSystemMessage(String content) {
        ChatMessageResponse systemMessage = new ChatMessageResponse(
                null,
                "系统",
                content,
                LocalDateTime.now(),
                MessageType.SYSTEM.name()
        );
        messagingTemplate.convertAndSend(BROADCAST_DESTINATION, systemMessage);
    }

    private void broadcastPresence(PresenceUpdateResponse payload) {
        messagingTemplate.convertAndSend(PRESENCE_DESTINATION, payload);
    }
}

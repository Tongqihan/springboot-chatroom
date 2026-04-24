package com.example.chatroom.websocket;

import com.example.chatroom.common.ChatRoom;
import com.example.chatroom.dto.ChatMessageRequest;
import com.example.chatroom.dto.ChatMessageResponse;
import com.example.chatroom.dto.MessageType;
import com.example.chatroom.dto.PresenceUpdateResponse;
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

    private static final String ROOM_TOPIC_PREFIX = "/topic/rooms/";

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
        messagingTemplate.convertAndSend(getRoomMessagesDestination(saved.roomName()), saved);
    }

    @MessageMapping("/chat.join")
    public void onJoin(
            @Valid @Payload UserPresenceRequest request,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String username = request.username().trim();
        String room = ChatRoom.normalizeAndValidate(request.room());
        String sessionId = headerAccessor.getSessionId();

        PresenceUpdateResponse presence = onlineUserService.userJoined(sessionId, username, room);
        broadcastSystemMessage(room, username + " 加入了聊天室");
        broadcastPresence(room, presence);
    }

    @MessageMapping("/chat.leave")
    public void onLeave(
            @Valid @Payload UserPresenceRequest request,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String username = request.username().trim();
        String room = ChatRoom.normalizeAndValidate(request.room());
        String sessionId = headerAccessor.getSessionId();

        OnlineUserService.SessionRoomUser sessionRoomUser = onlineUserService.getSessionRoomUser(sessionId);
        PresenceUpdateResponse presence = onlineUserService.userLeftBySessionAndName(sessionId, username, room);

        String leaveUser = sessionRoomUser == null ? username : sessionRoomUser.username();
        String leaveRoom = sessionRoomUser == null ? room : sessionRoomUser.room();

        if (sessionRoomUser != null) {
            broadcastSystemMessage(leaveRoom, leaveUser + " 离开了聊天室");
        }
        broadcastPresence(leaveRoom, presence);
    }

    void onDisconnected(String sessionId) {
        OnlineUserService.SessionRoomUser sessionRoomUser = onlineUserService.getSessionRoomUser(sessionId);
        PresenceUpdateResponse presence = onlineUserService.userLeftBySession(sessionId);
        if (sessionRoomUser != null) {
            broadcastSystemMessage(sessionRoomUser.room(), sessionRoomUser.username() + " 离开了聊天室");
            broadcastPresence(sessionRoomUser.room(), presence);
        }
    }

    private void broadcastSystemMessage(String room, String content) {
        ChatMessageResponse systemMessage = new ChatMessageResponse(
                null,
                room,
                "系统",
                content,
                LocalDateTime.now(),
                MessageType.SYSTEM.name()
        );
        messagingTemplate.convertAndSend(getRoomMessagesDestination(room), systemMessage);
    }

    private void broadcastPresence(String room, PresenceUpdateResponse payload) {
        if (payload == null) {
            return;
        }
        messagingTemplate.convertAndSend(getRoomPresenceDestination(room), payload);
    }

    private String getRoomMessagesDestination(String room) {
        return ROOM_TOPIC_PREFIX + room + "/messages";
    }

    private String getRoomPresenceDestination(String room) {
        return ROOM_TOPIC_PREFIX + room + "/presence";
    }
}

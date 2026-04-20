package com.example.chatroom.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * WebSocket 生命周期事件监听。
 */
@Component
public class WebSocketEventListener {

    private final ChatWebSocketController chatWebSocketController;

    public WebSocketEventListener(ChatWebSocketController chatWebSocketController) {
        this.chatWebSocketController = chatWebSocketController;
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        chatWebSocketController.onDisconnected(accessor.getSessionId());
    }
}

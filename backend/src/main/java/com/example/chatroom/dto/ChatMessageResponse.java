package com.example.chatroom.dto;

import java.time.LocalDateTime;

/**
 * 对外返回的聊天消息。
 */
public record ChatMessageResponse(
        Long id,
        String roomName,
        String username,
        String content,
        LocalDateTime createdAt,
        String type
) {
}

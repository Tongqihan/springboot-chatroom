package com.example.chatroom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 客户端发送消息请求。
 */
public record ChatMessageRequest(
        @NotBlank(message = "username 不能为空") @Size(max = 50, message = "username 长度不能超过 50") String username,
        @NotBlank(message = "content 不能为空") @Size(max = 1000, message = "content 长度不能超过 1000") String content
) {
}

package com.example.chatroom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 用户上线/离线事件请求。
 */
public record UserPresenceRequest(
        @NotBlank(message = "username 不能为空") @Size(max = 50, message = "username 长度不能超过 50") String username
) {
}

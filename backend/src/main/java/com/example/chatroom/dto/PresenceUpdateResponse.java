package com.example.chatroom.dto;

import java.util.List;

/**
 * 在线用户信息广播。
 */
public record PresenceUpdateResponse(
        int onlineCount,
        List<String> users
) {
}

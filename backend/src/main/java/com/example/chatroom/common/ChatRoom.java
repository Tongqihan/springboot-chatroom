package com.example.chatroom.common;

import java.util.List;

/**
 * 预设聊天室房间定义。
 */
public final class ChatRoom {

    public static final String LOBBY = "lobby";
    public static final String TECH = "tech";
    public static final String CASUAL = "casual";

    public static final List<String> DEFAULT_ROOMS = List.of(LOBBY, TECH, CASUAL);

    private ChatRoom() {
    }

    public static String normalizeAndValidate(String room) {
        String normalized = room == null ? "" : room.trim().toLowerCase();
        if (!DEFAULT_ROOMS.contains(normalized)) {
            throw new IllegalArgumentException("不支持的房间: " + room);
        }
        return normalized;
    }
}

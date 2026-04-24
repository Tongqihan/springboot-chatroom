package com.example.chatroom.common;

public final class ChatRoom {

    public static final String LOBBY = "lobby";
    public static final String TECH = "tech";
    public static final String CASUAL = "casual";

    private ChatRoom() {
    }

    public static String normalizeAndValidate(String room) {
        String normalized = room == null ? "" : room.trim().toLowerCase();
        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("roomName 不能为空");
        }
        if (normalized.length() > 100) {
            throw new IllegalArgumentException("roomName 长度不能超过 100");
        }
        return normalized;
    }
}

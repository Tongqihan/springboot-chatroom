package com.example.chatroom.service;

import com.example.chatroom.dto.PresenceUpdateResponse;

/**
 * 在线用户管理服务。
 */
public interface OnlineUserService {

    PresenceUpdateResponse userJoined(String sessionId, String username, String room);

    PresenceUpdateResponse userLeftBySession(String sessionId);

    PresenceUpdateResponse userLeftBySessionAndName(String sessionId, String username, String room);

    SessionRoomUser getSessionRoomUser(String sessionId);

    record SessionRoomUser(String username, String room) {
    }
}

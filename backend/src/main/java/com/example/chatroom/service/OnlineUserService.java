package com.example.chatroom.service;

import com.example.chatroom.dto.PresenceUpdateResponse;

/**
 * 在线用户管理服务。
 */
public interface OnlineUserService {

    PresenceUpdateResponse userJoined(String sessionId, String username);

    PresenceUpdateResponse userLeftBySession(String sessionId);

    PresenceUpdateResponse userLeftBySessionAndName(String sessionId, String username);

    String getUsernameBySession(String sessionId);
}

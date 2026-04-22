package com.example.chatroom.service.impl;

import com.example.chatroom.common.ChatRoom;
import com.example.chatroom.dto.PresenceUpdateResponse;
import com.example.chatroom.service.OnlineUserService;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/**
 * 在线用户状态管理（内存实现）。
 */
@Service
public class OnlineUserServiceImpl implements OnlineUserService {

    private final ConcurrentHashMap<String, SessionRoomUser> sessionStateMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, ConcurrentHashMap<String, Integer>> roomUserSessionCount = new ConcurrentHashMap<>();

    @Override
    public synchronized PresenceUpdateResponse userJoined(String sessionId, String username, String room) {
        String normalizedUsername = normalizeUsername(username);
        String normalizedRoom = ChatRoom.normalizeAndValidate(room);
        if (normalizedUsername == null || sessionId == null || sessionId.isBlank()) {
            return snapshot(normalizedRoom);
        }

        SessionRoomUser previous = sessionStateMap.put(sessionId, new SessionRoomUser(normalizedUsername, normalizedRoom));
        if (previous != null) {
            decreaseUserCount(previous.room(), previous.username());
        }

        increaseUserCount(normalizedRoom, normalizedUsername);
        return snapshot(normalizedRoom);
    }

    @Override
    public synchronized PresenceUpdateResponse userLeftBySession(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            return null;
        }

        SessionRoomUser removed = sessionStateMap.remove(sessionId);
        if (removed == null) {
            return null;
        }

        decreaseUserCount(removed.room(), removed.username());
        return snapshot(removed.room());
    }

    @Override
    public synchronized PresenceUpdateResponse userLeftBySessionAndName(String sessionId, String username, String room) {
        String normalizedRoom = ChatRoom.normalizeAndValidate(room);
        String normalizedUsername = normalizeUsername(username);

        SessionRoomUser removed = sessionId == null || sessionId.isBlank() ? null : sessionStateMap.remove(sessionId);
        if (removed != null) {
            decreaseUserCount(removed.room(), removed.username());
            return snapshot(removed.room());
        }

        if (normalizedUsername != null) {
            decreaseUserCount(normalizedRoom, normalizedUsername);
        }

        return snapshot(normalizedRoom);
    }

    @Override
    public synchronized SessionRoomUser getSessionRoomUser(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            return null;
        }
        return sessionStateMap.get(sessionId);
    }

    private PresenceUpdateResponse snapshot(String room) {
        ConcurrentHashMap<String, Integer> userCountMap = roomUserSessionCount.get(room);
        List<String> users = userCountMap == null ? new ArrayList<>() : new ArrayList<>(userCountMap.keySet());
        users.sort(Comparator.naturalOrder());
        return new PresenceUpdateResponse(users.size(), users, room);
    }

    private String normalizeUsername(String username) {
        if (username == null) {
            return null;
        }
        String trimmed = username.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void increaseUserCount(String room, String username) {
        roomUserSessionCount.computeIfAbsent(room, key -> new ConcurrentHashMap<>()).merge(username, 1, Integer::sum);
    }

    private void decreaseUserCount(String room, String username) {
        roomUserSessionCount.computeIfPresent(room, (key, userCountMap) -> {
            userCountMap.computeIfPresent(username, (name, current) -> current <= 1 ? null : current - 1);
            return userCountMap.isEmpty() ? null : userCountMap;
        });
    }
}

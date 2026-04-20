package com.example.chatroom.service.impl;

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

    private final ConcurrentHashMap<String, String> sessionUserMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Integer> usernameSessionCount = new ConcurrentHashMap<>();

    @Override
    public synchronized PresenceUpdateResponse userJoined(String sessionId, String username) {
        String normalizedUsername = normalize(username);
        if (normalizedUsername == null || sessionId == null || sessionId.isBlank()) {
            return snapshot();
        }

        String previousUser = sessionUserMap.put(sessionId, normalizedUsername);
        if (previousUser != null) {
            decreaseUserCount(previousUser);
        }
        increaseUserCount(normalizedUsername);
        return snapshot();
    }

    @Override
    public synchronized PresenceUpdateResponse userLeftBySession(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            return snapshot();
        }
        String removed = sessionUserMap.remove(sessionId);
        if (removed != null) {
            decreaseUserCount(removed);
        }
        return snapshot();
    }

    @Override
    public synchronized PresenceUpdateResponse userLeftBySessionAndName(String sessionId, String username) {
        String normalizedUsername = normalize(username);
        String removed = sessionId == null || sessionId.isBlank() ? null : sessionUserMap.remove(sessionId);

        if (removed != null) {
            decreaseUserCount(removed);
            return snapshot();
        }

        if (normalizedUsername != null) {
            decreaseUserCount(normalizedUsername);
        }

        return snapshot();
    }

    @Override
    public synchronized String getUsernameBySession(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            return null;
        }
        return sessionUserMap.get(sessionId);
    }

    private PresenceUpdateResponse snapshot() {
        List<String> users = new ArrayList<>(usernameSessionCount.keySet());
        users.sort(Comparator.naturalOrder());
        return new PresenceUpdateResponse(users.size(), users);
    }

    private String normalize(String username) {
        if (username == null) {
            return null;
        }
        String trimmed = username.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void increaseUserCount(String username) {
        usernameSessionCount.merge(username, 1, Integer::sum);
    }

    private void decreaseUserCount(String username) {
        usernameSessionCount.computeIfPresent(username, (key, current) -> current <= 1 ? null : current - 1);
    }
}

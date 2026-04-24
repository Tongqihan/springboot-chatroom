package com.example.chatroom.service.impl;

import com.example.chatroom.common.ChatRoom;
import com.example.chatroom.dto.ChatMessageRequest;
import com.example.chatroom.dto.ChatMessageResponse;
import com.example.chatroom.dto.MessageType;
import com.example.chatroom.entity.ChatMessage;
import com.example.chatroom.repository.ChatMessageRepository;
import com.example.chatroom.service.ChatService;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 聊天消息核心业务实现。
 */
@Service
public class ChatServiceImpl implements ChatService {

    private static final int DEFAULT_LIMIT = 50;
    private static final int MAX_LIMIT = 200;

    private final ChatMessageRepository chatMessageRepository;

    public ChatServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    @Transactional
    public ChatMessageResponse saveMessage(ChatMessageRequest request) {
        String roomName = ChatRoom.normalizeAndValidate(request.room());
        String username = sanitizeUsername(request.username());
        String content = sanitizeContent(request.content());

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setRoomName(roomName);
        chatMessage.setUsername(username);
        chatMessage.setContent(content);
        chatMessage.setCreatedAt(LocalDateTime.now());

        ChatMessage saved = chatMessageRepository.save(chatMessage);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getRecentMessages(String room, int limit) {
        int safeLimit = sanitizeLimit(limit);
        String roomName = ChatRoom.normalizeAndValidate(room);
        List<ChatMessage> messages = chatMessageRepository.findByRoomNameOrderByCreatedAtDesc(
                roomName,
                PageRequest.of(0, safeLimit)
        );
        Collections.reverse(messages);
        return messages.stream().map(this::toResponse).toList();
    }

    private int sanitizeLimit(int limit) {
        if (limit <= 0) {
            return DEFAULT_LIMIT;
        }
        return Math.min(limit, MAX_LIMIT);
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getRoomName(),
                message.getUsername(),
                message.getContent(),
                message.getCreatedAt(),
                MessageType.CHAT.name()
        );
    }

    private String sanitizeUsername(String username) {
        if (username == null) {
            throw new IllegalArgumentException("username 不能为空");
        }
        String trimmed = username.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("username 不能为空");
        }
        return trimmed;
    }

    private String sanitizeContent(String content) {
        if (content == null) {
            throw new IllegalArgumentException("content 不能为空");
        }
        String trimmed = content.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("content 不能为空");
        }
        return trimmed;
    }
}

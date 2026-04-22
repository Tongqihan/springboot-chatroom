package com.example.chatroom.service.impl;

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
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setUsername(request.username().trim());
        chatMessage.setContent(request.content().trim());
        chatMessage.setTimestamp(LocalDateTime.now());

        ChatMessage saved = chatMessageRepository.save(chatMessage);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getRecentMessages(int limit) {
        int safeLimit = sanitizeLimit(limit);
        List<ChatMessage> messages = chatMessageRepository.findByOrderByTimestampDesc(PageRequest.of(0, safeLimit));
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
                message.getUsername(),
                message.getContent(),
                message.getTimestamp(),
                MessageType.CHAT.name()
        );
    }
}

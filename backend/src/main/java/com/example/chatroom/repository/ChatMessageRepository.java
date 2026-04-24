package com.example.chatroom.repository;

import com.example.chatroom.entity.ChatMessage;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRoomNameOrderByCreatedAtDesc(String roomName, Pageable pageable);
}

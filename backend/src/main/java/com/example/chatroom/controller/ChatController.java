package com.example.chatroom.controller;

import com.example.chatroom.common.ApiResponse;
import com.example.chatroom.dto.ChatMessageResponse;
import com.example.chatroom.service.ChatService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 聊天 REST 接口。
 */
@RestController
@RequestMapping("/api/rooms")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/{roomName}/messages")
    public ApiResponse<List<ChatMessageResponse>> getRecentMessages(
            @PathVariable String roomName,
            @RequestParam(defaultValue = "50") int limit
    ) {
        return ApiResponse.ok("查询成功", chatService.getRecentMessages(roomName, limit));
    }
}

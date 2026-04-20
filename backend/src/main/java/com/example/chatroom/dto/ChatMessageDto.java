package com.example.chatroom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatMessageDto(
        @NotBlank @Size(max = 50) String sender,
        @NotBlank @Size(max = 1000) String content
) {
}

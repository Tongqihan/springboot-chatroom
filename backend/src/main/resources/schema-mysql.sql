CREATE DATABASE IF NOT EXISTS chatroom_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE chatroom_db;

CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  room_name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  KEY idx_chat_messages_room_created_at (room_name, created_at)
);

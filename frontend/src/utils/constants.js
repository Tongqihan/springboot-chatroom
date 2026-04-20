export const APP_NAME = 'SpringBoot Chatroom';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? 'ws://localhost:8080/ws/chat';
export const DEFAULT_HISTORY_LIMIT = 50;

export const WS_DESTINATIONS = {
  SEND_MESSAGE: '/app/chat.send',
  TOPIC_MESSAGES: '/topic/messages',
};

export const CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
};

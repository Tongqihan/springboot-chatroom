import { Client } from '@stomp/stompjs';
import { API_BASE_URL, DEFAULT_HISTORY_LIMIT, WS_BASE_URL, WS_DESTINATIONS } from '../utils/constants';

async function request(path) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`);
  } catch (error) {
    throw new Error('后端不可用，请确认后端服务已启动');
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (!payload.success) {
    throw new Error(payload.message || '接口返回失败');
  }

  return payload.data;
}

export async function fetchRecentMessages(room, limit = DEFAULT_HISTORY_LIMIT) {
  return request(`/api/messages/recent?room=${encodeURIComponent(room)}&limit=${limit}`);
}

export function createChatSocket({ room, onMessage, onPresence, onConnect, onDisconnect, onStompError, onWebSocketError }) {
  const client = new Client({
    brokerURL: WS_BASE_URL,
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });

  client.onConnect = () => {
    client.subscribe(WS_DESTINATIONS.roomMessages(room), (frame) => {
      const message = JSON.parse(frame.body);
      onMessage?.(message);
    });

    client.subscribe(WS_DESTINATIONS.roomPresence(room), (frame) => {
      const presence = JSON.parse(frame.body);
      onPresence?.(presence);
    });

    onConnect?.();
  };

  client.onDisconnect = () => {
    onDisconnect?.();
  };

  client.onWebSocketClose = () => {
    onDisconnect?.();
  };

  client.onStompError = (frame) => {
    onStompError?.(frame.headers?.message || 'STOMP 错误');
  };

  client.onWebSocketError = () => {
    onWebSocketError?.('WebSocket 连接失败，请确认后端服务已启动');
  };

  return {
    connect() {
      client.activate();
    },
    disconnect() {
      client.deactivate();
    },
    sendMessage(payload) {
      client.publish({
        destination: WS_DESTINATIONS.SEND_MESSAGE,
        body: JSON.stringify(payload),
      });
    },
    joinChat(username, joinedRoom) {
      client.publish({
        destination: WS_DESTINATIONS.JOIN_CHAT,
        body: JSON.stringify({ username, room: joinedRoom }),
      });
    },
    leaveChat(username, leftRoom) {
      client.publish({
        destination: WS_DESTINATIONS.LEAVE_CHAT,
        body: JSON.stringify({ username, room: leftRoom }),
      });
    },
    isConnected() {
      return client.connected;
    },
  };
}

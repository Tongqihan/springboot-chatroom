export const APP_NAME = 'SpringBoot Chatroom';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const defaultWsBaseUrl = API_BASE_URL.replace(/^http/, 'ws');
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? `${defaultWsBaseUrl}/ws/chat`;
export const DEFAULT_HISTORY_LIMIT = 50;

export const DEFAULT_ROOM_SUGGESTIONS = ['lobby', 'room1', 'room2'];
export const DEFAULT_ROOM = DEFAULT_ROOM_SUGGESTIONS[0];
export const ROOM_HISTORY_STORAGE_KEY = 'chatroom-recent-rooms';

export const WS_DESTINATIONS = {
  SEND_MESSAGE: '/app/chat.send',
  JOIN_CHAT: '/app/chat.join',
  LEAVE_CHAT: '/app/chat.leave',
  roomMessages: (room) => `/topic/rooms/${room}/messages`,
  roomPresence: (room) => `/topic/rooms/${room}/presence`,
};

export const MESSAGE_TYPE = {
  CHAT: 'CHAT',
  SYSTEM: 'SYSTEM',
};

export const CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
};

export function normalizeRoomName(value) {
  return value.trim().toLowerCase();
}

export function getSuggestedRooms() {
  if (typeof window === 'undefined') {
    return [...DEFAULT_ROOM_SUGGESTIONS];
  }

  try {
    const storedValue = window.localStorage.getItem(ROOM_HISTORY_STORAGE_KEY);
    const parsedRooms = storedValue ? JSON.parse(storedValue) : [];
    return dedupeRooms([...DEFAULT_ROOM_SUGGESTIONS, ...parsedRooms]);
  } catch {
    return [...DEFAULT_ROOM_SUGGESTIONS];
  }
}

export function saveSuggestedRoom(roomName) {
  if (typeof window === 'undefined') {
    return;
  }

  const normalizedRoom = normalizeRoomName(roomName);
  if (!normalizedRoom) {
    return;
  }

  const nextRooms = dedupeRooms([normalizedRoom, ...getSuggestedRooms()]);
  window.localStorage.setItem(ROOM_HISTORY_STORAGE_KEY, JSON.stringify(nextRooms.slice(0, 10)));
}

function dedupeRooms(rooms) {
  return [...new Set(rooms.map(normalizeRoomName).filter(Boolean))];
}

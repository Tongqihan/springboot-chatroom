export function createInitialChatState() {
  return {
    messages: [],
    onlineCount: 0,
    onlineUsers: [],
    historyError: '',
    wsError: '',
  };
}

export function addMessage(messages, message) {
  return [...messages, message];
}

export function setHistory(messages) {
  return [...messages];
}

export function setPresence(presence) {
  return {
    onlineCount: presence?.onlineCount ?? 0,
    onlineUsers: Array.isArray(presence?.users) ? [...presence.users] : [],
  };
}

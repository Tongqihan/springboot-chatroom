export function createInitialChatState() {
  return {
    messages: [],
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

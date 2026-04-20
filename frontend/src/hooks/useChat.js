import { useCallback, useEffect, useRef, useState } from 'react';
import { createChatSocket, fetchRecentMessages } from '../api/chatApi';
import { CONNECTION_STATUS } from '../utils/constants';
import { addMessage, createInitialChatState, setHistory, setPresence } from '../store/chatStore';

export function useChat(nickname) {
  const [state, setState] = useState(createInitialChatState);
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!nickname) {
      return;
    }

    let mounted = true;
    setConnectionStatus(CONNECTION_STATUS.CONNECTING);

    fetchRecentMessages()
      .then((messages) => {
        if (!mounted) {
          return;
        }
        setState((previous) => ({ ...previous, messages: setHistory(messages), historyError: '' }));
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }
        setState((previous) => ({ ...previous, historyError: error.message || '未知错误' }));
      });

    const socket = createChatSocket({
      onMessage: (message) => {
        if (!mounted) {
          return;
        }
        setState((previous) => ({ ...previous, messages: addMessage(previous.messages, message) }));
      },
      onPresence: (presence) => {
        if (!mounted) {
          return;
        }
        setState((previous) => ({ ...previous, ...setPresence(presence) }));
      },
      onConnect: () => {
        if (!mounted) {
          return;
        }
        setConnectionStatus(CONNECTION_STATUS.CONNECTED);
        socket.joinChat(nickname);
        setState((previous) => ({ ...previous, wsError: '' }));
      },
      onDisconnect: () => {
        if (!mounted) {
          return;
        }
        setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
        setState((previous) => ({
          ...previous,
          wsError: 'WebSocket 已断开，正在每 3 秒自动重连',
        }));
      },
      onStompError: (errorMessage) => {
        if (!mounted) {
          return;
        }
        setConnectionStatus(CONNECTION_STATUS.ERROR);
        setState((previous) => ({ ...previous, wsError: errorMessage }));
      },
      onWebSocketError: (errorMessage) => {
        if (!mounted) {
          return;
        }
        setConnectionStatus(CONNECTION_STATUS.ERROR);
        setState((previous) => ({ ...previous, wsError: errorMessage }));
      },
    });

    socket.connect();
    socketRef.current = socket;

    return () => {
      mounted = false;
      if (socket.isConnected()) {
        socket.leaveChat(nickname);
      }
      socket.disconnect();
      socketRef.current = null;
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    };
  }, [nickname]);

  const sendMessage = useCallback(
    (content) => {
      if (!nickname || !socketRef.current?.isConnected()) {
        setState((previous) => ({ ...previous, wsError: 'WebSocket 未连接，消息未发送' }));
        return;
      }

      socketRef.current.sendMessage({ username: nickname, content });
    },
    [nickname]
  );

  return {
    messages: state.messages,
    onlineCount: state.onlineCount,
    onlineUsers: state.onlineUsers,
    historyError: state.historyError,
    wsError: state.wsError,
    connectionStatus,
    sendMessage,
  };
}

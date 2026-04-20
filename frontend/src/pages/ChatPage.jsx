import { ChatLayout } from '../components/ChatLayout';
import { useChat } from '../hooks/useChat';

function ChatPage({ nickname, onLeave }) {
  const { messages, onlineCount, onlineUsers, connectionStatus, historyError, wsError, sendMessage } = useChat(nickname);

  return (
    <ChatLayout
      nickname={nickname}
      messages={messages}
      onlineCount={onlineCount}
      onlineUsers={onlineUsers}
      connectionStatus={connectionStatus}
      historyError={historyError}
      wsError={wsError}
      onSend={sendMessage}
      onLeave={onLeave}
    />
  );
}

export default ChatPage;

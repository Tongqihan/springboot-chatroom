import { ChatLayout } from '../components/ChatLayout';
import { useChat } from '../hooks/useChat';

function ChatPage({ nickname, room, onRoomChange, onLeave }) {
  const { messages, onlineCount, onlineUsers, connectionStatus, historyError, wsError, sendMessage } = useChat(nickname, room);

  return (
    <ChatLayout
      nickname={nickname}
      room={room}
      onRoomChange={onRoomChange}
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

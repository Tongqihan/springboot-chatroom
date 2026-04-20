import { ChatLayout } from '../components/ChatLayout';
import { useChat } from '../hooks/useChat';

function ChatPage({ nickname, onLeave }) {
  const { messages, connectionStatus, historyError, wsError, sendMessage } = useChat(nickname);

  return (
    <ChatLayout
      nickname={nickname}
      messages={messages}
      connectionStatus={connectionStatus}
      historyError={historyError}
      wsError={wsError}
      onSend={sendMessage}
      onLeave={onLeave}
    />
  );
}

export default ChatPage;

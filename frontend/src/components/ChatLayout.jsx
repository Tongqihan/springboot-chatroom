import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function ChatLayout({ nickname, messages, connectionStatus, historyError, wsError, onSend, onLeave }) {
  const isConnected = connectionStatus === 'connected';

  return (
    <section className="chat-card">
      <header className="chat-header">
        <div>
          <h1>聊天室</h1>
          <p>当前用户：{nickname}</p>
        </div>
        <div className="chat-status-wrap">
          <span className={`status ${connectionStatus}`}>连接状态：{connectionStatus}</span>
          <button className="secondary" onClick={onLeave}>退出</button>
        </div>
      </header>

      {historyError ? <p className="error">历史消息加载失败：{historyError}</p> : null}
      {wsError ? <p className="error">连接异常：{wsError}</p> : null}

      <MessageList messages={messages} currentUser={nickname} />
      <MessageInput onSend={onSend} disabled={!isConnected} />
    </section>
  );
}

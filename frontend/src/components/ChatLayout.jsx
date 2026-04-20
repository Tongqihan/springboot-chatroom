import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function ChatLayout({ nickname, messages, connectionStatus, historyError, wsError, onSend, onLeave }) {
  const isConnected = connectionStatus === 'connected';
  const statusLabelMap = {
    connected: '已连接',
    connecting: '连接中',
    disconnected: '已断开（将自动重连）',
    error: '连接异常',
  };
  const statusLabel = statusLabelMap[connectionStatus] || connectionStatus;

  return (
    <section className="chat-card">
      <header className="chat-header">
        <div>
          <h1>聊天室</h1>
          <p>当前用户：{nickname}</p>
        </div>
        <div className="chat-status-wrap">
          <span className={`status ${connectionStatus}`}>连接状态：{statusLabel}</span>
          <button className="secondary" onClick={onLeave}>退出</button>
        </div>
      </header>

      {historyError ? <p className="error">历史消息加载失败：{historyError}</p> : null}
      {wsError ? <p className="error connection-error">连接异常：{wsError}</p> : null}

      <MessageList messages={messages} currentUser={nickname} />
      <MessageInput onSend={onSend} disabled={!isConnected} />
    </section>
  );
}

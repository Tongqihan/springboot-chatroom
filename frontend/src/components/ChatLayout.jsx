import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ROOM_LIST } from '../utils/constants';

export function ChatLayout({
  nickname,
  room,
  onRoomChange,
  messages,
  onlineCount,
  onlineUsers,
  connectionStatus,
  historyError,
  wsError,
  onSend,
  onLeave,
}) {
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
          <p>当前房间：{room}</p>
          <p>在线人数：{onlineCount}</p>
        </div>
        <div className="chat-status-wrap">
          <span className={`status ${connectionStatus}`}>连接状态：{statusLabel}</span>
          <button className="secondary" onClick={onLeave}>退出</button>
        </div>
      </header>

      <section className="room-switcher">
        <label htmlFor="room-select">切换房间</label>
        <select id="room-select" value={room} onChange={(event) => onRoomChange(event.target.value)}>
          {ROOM_LIST.map((roomName) => (
            <option key={roomName} value={roomName}>{roomName}</option>
          ))}
        </select>
      </section>

      <section className="online-users">
        <h2>在线用户</h2>
        {onlineUsers.length > 0 ? (
          <ul>
            {onlineUsers.map((user) => (
              <li key={user}>{user}</li>
            ))}
          </ul>
        ) : (
          <p>暂无在线用户</p>
        )}
      </section>

      {historyError ? <p className="error">历史消息加载失败：{historyError}</p> : null}
      {wsError ? <p className="error connection-error">连接异常：{wsError}</p> : null}

      <MessageList messages={messages} currentUser={nickname} />
      <MessageInput onSend={onSend} disabled={!isConnected} />
    </section>
  );
}

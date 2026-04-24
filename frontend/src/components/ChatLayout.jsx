import { useEffect, useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { getSuggestedRooms, normalizeRoomName } from '../utils/constants';

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
  const [roomInput, setRoomInput] = useState(room);
  const [roomError, setRoomError] = useState('');
  const [suggestedRooms, setSuggestedRooms] = useState(() => getSuggestedRooms());
  const isConnected = connectionStatus === 'connected';
  const statusLabelMap = {
    connected: '已连接',
    connecting: '连接中',
    disconnected: '已断开（将自动重连）',
    error: '连接异常',
  };
  const statusLabel = statusLabelMap[connectionStatus] || connectionStatus;

  useEffect(() => {
    setRoomInput(room);
    setSuggestedRooms(getSuggestedRooms());
  }, [room]);

  const handleRoomSubmit = (event) => {
    event.preventDefault();
    const nextRoom = normalizeRoomName(roomInput);
    if (!nextRoom) {
      setRoomError('请输入房间名');
      return;
    }
    if (nextRoom === room) {
      setRoomError('');
      return;
    }
    setRoomError('');
    setRoomInput(nextRoom);
    onRoomChange(nextRoom);
  };

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
          <button className="secondary" onClick={onLeave}>退出聊天室</button>
        </div>
      </header>

      <form className="room-switcher" onSubmit={handleRoomSubmit}>
        <label htmlFor="room-input">切换房间</label>
        <input
          id="room-input"
          value={roomInput}
          onChange={(event) => {
            setRoomInput(event.target.value);
            if (roomError) {
              setRoomError('');
            }
          }}
          onBlur={() => {
            const nextRoom = normalizeRoomName(roomInput);
            if (nextRoom) {
              setRoomInput(nextRoom);
            }
          }}
          placeholder="输入房间名"
          maxLength={100}
          list="chat-room-options"
        />
        <datalist id="chat-room-options">
          {suggestedRooms.map((roomName) => (
            <option key={roomName} value={roomName} />
          ))}
        </datalist>
        <button type="submit" className="secondary">切换</button>
        {roomError ? <p className="field-error room-switcher-error">{roomError}</p> : null}
      </form>

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

      <section className="message-panel">
        {historyError ? <p className="error">历史消息加载失败：{historyError}</p> : null}
        {wsError ? <p className="error connection-error">连接异常：{wsError}</p> : null}
        <MessageList messages={messages} currentUser={nickname} />
      </section>

      <section className="message-input-wrap">
        <MessageInput onSend={onSend} disabled={!isConnected} />
      </section>
    </section>
  );
}

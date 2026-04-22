import { useState } from 'react';
import { ROOM_LIST } from '../utils/constants';

export function EntryForm({ defaultRoom, onEnter }) {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState(defaultRoom);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) {
      return;
    }
    onEnter({ nickname: trimmed, room });
  };

  return (
    <section className="entry-card">
      <h1>进入聊天室</h1>
      <p>输入昵称并选择房间，开始实时群聊。</p>

      <form onSubmit={handleSubmit} className="entry-form entry-form-column">
        <input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="请输入昵称"
          maxLength={50}
          aria-label="nickname"
        />
        <select value={room} onChange={(event) => setRoom(event.target.value)} aria-label="room">
          {ROOM_LIST.map((roomName) => (
            <option key={roomName} value={roomName}>{roomName}</option>
          ))}
        </select>
        <button type="submit">进入</button>
      </form>
    </section>
  );
}

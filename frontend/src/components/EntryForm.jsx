import { useEffect, useState } from 'react';
import { getSuggestedRooms, normalizeRoomName } from '../utils/constants';

export function EntryForm({ defaultRoom, onEnter }) {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState(defaultRoom);
  const [roomError, setRoomError] = useState('');
  const [suggestedRooms, setSuggestedRooms] = useState(() => getSuggestedRooms());

  useEffect(() => {
    setSuggestedRooms(getSuggestedRooms());
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = nickname.trim();
    const normalizedRoom = normalizeRoomName(room);
    if (!normalizedRoom) {
      setRoomError('请输入房间名');
      return;
    }

    if (!trimmed) {
      return;
    }

    setRoomError('');
    setRoom(normalizedRoom);
    onEnter({ nickname: trimmed, room: normalizedRoom });
  };

  return (
    <section className="entry-card">
      <h1>SpringBoot Chatroom</h1>
      <p>v0.6.1 自定义房间版：输入昵称和房间名，开始实时群聊，历史消息会自动保存。</p>

      <form onSubmit={handleSubmit} className="entry-form entry-form-column">
        <input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="请输入昵称"
          maxLength={50}
          aria-label="nickname"
        />
        <input
          value={room}
          onChange={(event) => {
            setRoom(event.target.value);
            if (roomError) {
              setRoomError('');
            }
          }}
          onBlur={() => {
            const normalizedRoom = normalizeRoomName(room);
            if (normalizedRoom) {
              setRoom(normalizedRoom);
            }
          }}
          placeholder="请输入房间名，如 lobby / room1"
          maxLength={100}
          aria-label="room"
          list="room-options"
        />
        {roomError ? <p className="field-error">{roomError}</p> : null}
        <datalist id="room-options">
          {suggestedRooms.map((roomName) => (
            <option key={roomName} value={roomName} />
          ))}
        </datalist>
        <button type="submit">进入聊天室</button>
      </form>
    </section>
  );
}

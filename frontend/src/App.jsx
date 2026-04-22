import { useState } from 'react';
import ChatPage from './pages/ChatPage';
import EnterPage from './pages/EnterPage';
import { APP_NAME, DEFAULT_ROOM } from './utils/constants';

function App() {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState(DEFAULT_ROOM);

  return (
    <div className="app-shell">
      <header className="app-header">{APP_NAME}</header>
      {nickname ? (
        <ChatPage nickname={nickname} room={room} onRoomChange={setRoom} onLeave={() => setNickname('')} />
      ) : (
        <EnterPage defaultRoom={room} onEnter={({ nickname: nextNickname, room: nextRoom }) => {
          setRoom(nextRoom);
          setNickname(nextNickname);
        }} />
      )}
    </div>
  );
}

export default App;

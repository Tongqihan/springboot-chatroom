import { useState } from 'react';
import ChatPage from './pages/ChatPage';
import EnterPage from './pages/EnterPage';
import { DEFAULT_ROOM } from './utils/constants';

function App() {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState(DEFAULT_ROOM);
  const isEntered = Boolean(nickname);

  return (
    <div className={`app-shell ${isEntered ? 'chat-mode' : 'entry-mode'}`}>
      {isEntered ? (
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

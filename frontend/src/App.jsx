import { useState } from 'react';
import ChatPage from './pages/ChatPage';
import EnterPage from './pages/EnterPage';
import { DEFAULT_ROOM, normalizeRoomName, saveSuggestedRoom } from './utils/constants';

function App() {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState(DEFAULT_ROOM);
  const isEntered = Boolean(nickname);

  const handleEnter = ({ nickname: nextNickname, room: nextRoom }) => {
    const normalizedRoom = normalizeRoomName(nextRoom);
    saveSuggestedRoom(normalizedRoom);
    setRoom(normalizedRoom);
    setNickname(nextNickname);
  };

  const handleRoomChange = (nextRoom) => {
    const normalizedRoom = normalizeRoomName(nextRoom);
    if (!normalizedRoom) {
      return;
    }
    saveSuggestedRoom(normalizedRoom);
    setRoom(normalizedRoom);
  };

  return (
    <div className={`app-shell ${isEntered ? 'chat-mode' : 'entry-mode'}`}>
      {isEntered ? (
        <ChatPage
          nickname={nickname}
          room={room}
          onRoomChange={handleRoomChange}
          onLeave={() => setNickname('')}
        />
      ) : (
        <EnterPage defaultRoom={room} onEnter={handleEnter} />
      )}
    </div>
  );
}

export default App;

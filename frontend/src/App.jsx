import { useState } from 'react';
import ChatPage from './pages/ChatPage';
import EnterPage from './pages/EnterPage';
import { APP_NAME } from './utils/constants';

function App() {
  const [nickname, setNickname] = useState('');

  return (
    <div className="app-shell">
      <header className="app-header">{APP_NAME}</header>
      {nickname ? (
        <ChatPage nickname={nickname} onLeave={() => setNickname('')} />
      ) : (
        <EnterPage onEnter={setNickname} />
      )}
    </div>
  );
}

export default App;

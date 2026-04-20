import { formatTime } from '../utils/time';

export function MessageList({ messages, currentUser }) {
  return (
    <ul className="message-list">
      {messages.map((message) => {
        const isMine = message.username === currentUser;
        return (
          <li key={`${message.id ?? 'temp'}-${message.timestamp}-${message.content}`} className={isMine ? 'mine' : ''}>
            <div className="message-meta">
              <strong>{message.username}</strong>
              <span>{formatTime(message.timestamp)}</span>
            </div>
            <p>{message.content}</p>
          </li>
        );
      })}
    </ul>
  );
}

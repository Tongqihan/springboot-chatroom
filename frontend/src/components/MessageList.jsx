import { useEffect, useRef } from 'react';
import { formatTime } from '../utils/time';

export function MessageList({ messages, currentUser }) {
  const listRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!listRef.current || !bottomRef.current) {
      return;
    }
    bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <ul className="message-list" ref={listRef}>
      {messages.map((message) => {
        const isMine = message.username === currentUser;
        return (
          <li
            key={`${message.id ?? 'temp'}-${message.timestamp}-${message.content}`}
            className={isMine ? 'mine' : 'theirs'}
          >
            <div className="message-meta">
              <strong>{message.username}</strong>
              <span>{formatTime(message.timestamp)}</span>
            </div>
            <p>{message.content}</p>
          </li>
        );
      })}
      <li className="message-list-anchor" ref={bottomRef} aria-hidden="true" />
    </ul>
  );
}

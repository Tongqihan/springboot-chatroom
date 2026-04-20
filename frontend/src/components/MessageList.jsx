import { useEffect, useRef } from 'react';
import { MESSAGE_TYPE } from '../utils/constants';
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
        const type = message.type ?? MESSAGE_TYPE.CHAT;
        const isSystem = type === MESSAGE_TYPE.SYSTEM;
        const isMine = message.username === currentUser;
        const itemClassName = isSystem ? 'system' : isMine ? 'mine' : 'theirs';

        return (
          <li
            key={`${message.id ?? 'temp'}-${message.timestamp}-${message.username}-${message.content}`}
            className={itemClassName}
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

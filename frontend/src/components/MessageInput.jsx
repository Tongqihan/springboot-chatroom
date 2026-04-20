import { useState } from 'react';

export function MessageInput({ onSend, disabled }) {
  const [content, setContent] = useState('');
  const trimmedContent = content.trim();
  const canSend = !disabled && Boolean(trimmedContent);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSend) {
      return;
    }

    onSend(trimmedContent);
    setContent('');
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    if (canSend) {
      onSend(trimmedContent);
      setContent('');
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? '连接中或已断开，暂不可发送' : '输入消息...'}
        maxLength={1000}
        disabled={disabled}
      />
      <button type="submit" disabled={!canSend}>发送</button>
    </form>
  );
}

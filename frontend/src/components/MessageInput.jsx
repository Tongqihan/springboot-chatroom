import { useState } from 'react';

export function MessageInput({ onSend, disabled }) {
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setContent('');
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={disabled ? '连接中或已断开，暂不可发送' : '输入消息...'}
        maxLength={1000}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>发送</button>
    </form>
  );
}

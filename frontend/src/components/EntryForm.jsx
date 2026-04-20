import { useState } from 'react';

export function EntryForm({ onEnter }) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) {
      return;
    }
    onEnter(trimmed);
  };

  return (
    <section className="entry-card">
      <h1>进入聊天室</h1>
      <p>输入一个昵称，开始实时群聊。</p>

      <form onSubmit={handleSubmit} className="entry-form">
        <input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="请输入昵称"
          maxLength={50}
          aria-label="nickname"
        />
        <button type="submit">进入</button>
      </form>
    </section>
  );
}

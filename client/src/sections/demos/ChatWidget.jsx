import { useState } from 'react';
import { askChat, N8nError } from '../../lib/n8n.js';
import styles from './ChatWidget.module.css';

let nextId = 0;

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading

  async function handleSubmit(e) {
    e.preventDefault();
    const question = inputValue.trim();
    if (!question || status === 'loading') return;

    setMessages((prev) => [...prev, { id: nextId++, role: 'user', text: question }]);
    setInputValue('');
    setStatus('loading');

    try {
      // Each request only ever carries the current question — no conversation history is
      // sent, per the "independent query" requirement. `messages` above is local UI state
      // only; do not wire it into this payload.
      const data = await askChat(question);
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: 'assistant', text: data.answer, sources: data.sources || [] },
      ]);
    } catch (err) {
      const text = err instanceof N8nError
        ? err.message
        : 'Something went wrong reaching the assistant — please try again.';
      setMessages((prev) => [...prev, { id: nextId++, role: 'assistant', text, sources: [] }]);
    } finally {
      setStatus('idle');
    }
  }

  return (
    <div className={styles.widget}>
      <p className={styles.intro}>
        Ask a question — answers are grounded only in our ingested docs, with sources cited
        below.
      </p>

      <div className={styles.thread} aria-live="polite">
        {messages.length === 0 && (
          <p className={styles.emptyState}>Ask anything about n8n's official docs — try "What is a webhook node?"</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant}>
            <p className={styles.bubbleText}>{m.text}</p>
            {m.sources?.length > 0 && (
              <div className={styles.sources}>
                <span className={styles.sourcesLabel}>Sources</span>
                {m.sources.slice(0, 3).map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className={styles.sourcePill}>
                    {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {status === 'loading' && <div className={styles.bubbleAssistant}><p className={styles.bubbleText}>Thinking…</p></div>}
      </div>

      <form className={styles.inputRow} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question…"
          disabled={status === 'loading'}
          aria-label="Chat message"
        />
        <button className={styles.sendBtn} type="submit" disabled={status === 'loading' || !inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

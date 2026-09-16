import { useEffect, useRef, useState } from 'react';
import { askInterviewBot, N8nError } from '../lib/n8n.js';
import styles from './InterviewBot.module.css';

const STARTERS = [
  'Walk me through your background.',
  'What did you work on in the energy sector?',
  'Tell me about the PayMongo integration.',
  'How does your QA background shape how you build?',
];

// Only the last few turns are sent — enough for follow-ups ("what about the other one?")
// without growing the request forever.
const HISTORY_TURNS = 10;

let nextId = 0;

export default function InterviewBot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading
  const threadRef = useRef(null);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  async function ask(question) {
    if (!question || status === 'loading') return;

    const history = messages
      .slice(-HISTORY_TURNS * 2)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, { id: nextId++, role: 'user', text: question }]);
    setInputValue('');
    setStatus('loading');

    try {
      const data = await askInterviewBot(question, history);
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: 'assistant', text: data.answer, sources: data.sources || [] },
      ]);
    } catch (err) {
      const text = err instanceof N8nError
        ? err.message
        : 'Something went wrong reaching the assistant — please try again.';
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: 'assistant', text, isError: true },
      ]);
    } finally {
      setStatus('idle');
    }
  }

  return (
    <section id="interview" className="section section-alt">
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Interview bot</p>
            <h2 className="h2">Ask me your <span className="gradient-text">interview questions</span></h2>
          </div>
          <p className={`lede ${styles.sub}`}>
            Hiring, screening, or just curious? Ask about my background, projects, or how I
            work. Answers come straight from my own notes — if something isn't on file, it
            says so rather than guessing.
          </p>
        </div>

        <div className={styles.panel}>
          <div className={styles.thread} ref={threadRef} aria-live="polite">
            {messages.length === 0 && (
              <div className={styles.empty}>
                <p className={styles.emptyText}>Start with one of these, or ask your own:</p>
                <div className={styles.starters}>
                  {STARTERS.map((s) => (
                    <button key={s} type="button" className={styles.starter} onClick={() => ask(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === 'user'
                    ? styles.bubbleUser
                    : `${styles.bubbleAssistant} ${m.isError ? styles.bubbleError : ''}`
                }
              >
                <p className={styles.bubbleText}>{m.text}</p>
                {m.sources?.length > 0 && (
                  <div className={styles.sources}>
                    <span className={styles.sourcesLabel}>From</span>
                    {m.sources.map((s, i) => (
                      <span key={i} className={styles.sourcePill}>{s.title}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {status === 'loading' && (
              <div className={styles.bubbleAssistant}>
                <p className={styles.bubbleText}>Thinking…</p>
              </div>
            )}
          </div>

          <form
            className={styles.inputRow}
            onSubmit={(e) => {
              e.preventDefault();
              ask(inputValue.trim());
            }}
          >
            <input
              className={styles.input}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask an interview question…"
              maxLength={500}
              disabled={status === 'loading'}
              aria-label="Interview question"
            />
            <button
              className={styles.sendBtn}
              type="submit"
              disabled={status === 'loading' || !inputValue.trim()}
            >
              Ask
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

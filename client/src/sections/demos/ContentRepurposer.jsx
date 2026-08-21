import { useState } from 'react';
import { repurposeContent, N8nError } from '../../lib/n8n.js';
import styles from './ContentRepurposer.module.css';

const CHAR_LIMIT = 2000;

function isValidUrl(value) {
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

const RESULT_CARDS = [
  { key: 'tweet_thread', label: 'Twitter / X Thread' },
  { key: 'linkedin_post', label: 'LinkedIn Post' },
  { key: 'email_blurb', label: 'Email Blurb' },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently no-op, the text is still visible/selectable.
    }
  }
  return (
    <button type="button" className={styles.copyBtn} onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function ContentRepurposer() {
  const [mode, setMode] = useState('text');
  const [textValue, setTextValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [urlError, setUrlError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | rate_limited | error
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  function switchMode(next) {
    setMode(next);
    setUrlError('');
    if (next === 'text') setUrlValue('');
    else setTextValue('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setUrlError('');

    if (mode === 'text' && !textValue.trim()) return;
    if (mode === 'url') {
      if (!urlValue.trim() || !isValidUrl(urlValue)) {
        setUrlError('Enter a valid URL, e.g. https://example.com/post');
        return;
      }
    }

    setStatus('loading');
    setMessage('');
    try {
      const data = await repurposeContent({
        content: mode === 'text' ? textValue : '',
        sourceUrl: mode === 'url' ? urlValue.trim() : '',
      });
      setResult(data);
      setStatus('success');
    } catch (err) {
      if (err instanceof N8nError && err.kind === 'rate_limited') {
        setStatus('rate_limited');
      } else {
        setStatus('error');
      }
      setMessage(err.message);
    }
  }

  const loading = status === 'loading';

  return (
    <div className={styles.widget}>
      <div className={styles.modeToggle}>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'text' ? styles.modeActive : ''}`}
          onClick={() => switchMode('text')}
        >
          Paste text
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'url' ? styles.modeActive : ''}`}
          onClick={() => switchMode('url')}
        >
          Paste a URL
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === 'text' ? (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="repurposer-text">Source content</label>
            <textarea
              id="repurposer-text"
              className={styles.textarea}
              value={textValue}
              maxLength={CHAR_LIMIT}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Paste a blog post or paragraph…"
              disabled={loading}
            />
            <span className={`${styles.counter} ${textValue.length > CHAR_LIMIT * 0.95 ? styles.counterWarn : ''}`}>
              {textValue.length}/{CHAR_LIMIT}
            </span>
          </div>
        ) : (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="repurposer-url">Source URL</label>
            <input
              id="repurposer-url"
              className={styles.input}
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onBlur={() => { if (urlValue && !isValidUrl(urlValue)) setUrlError('Enter a valid URL, e.g. https://example.com/post'); }}
              placeholder="https://example.com/post"
              disabled={loading}
            />
            {urlError && <span className={styles.errorText}>{urlError}</span>}
          </div>
        )}

        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Repurposing…' : 'Repurpose content'}
        </button>
      </form>

      {status === 'rate_limited' && <p className={styles.rateLimitNotice}>{message}</p>}
      {status === 'error' && <p className={styles.errorNotice}>{message}</p>}

      {status === 'success' && result && (
        <div className={styles.results}>
          {RESULT_CARDS.map(({ key, label }) => (
            <div key={key} className={styles.resultCard}>
              <div className={styles.resultHead}>
                <span className={styles.resultLabel}>{label}</span>
                <CopyButton text={result[key]} />
              </div>
              <p className={styles.resultText}>{result[key]}</p>
            </div>
          ))}
          {result.tone && <span className={styles.toneLabel}>Tone: {result.tone}</span>}
        </div>
      )}
    </div>
  );
}

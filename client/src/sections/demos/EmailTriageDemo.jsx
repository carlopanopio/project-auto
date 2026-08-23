import { useEffect, useRef, useState } from 'react';
import { fetchEmailTriageFeed } from '../../lib/liveFeed.js';
import styles from './EmailTriageDemo.module.css';

const DEMO_MAILBOX = 'automationhubph@gmail.com';
const POLL_INTERVAL_MS = 5000;

const CATEGORY_CLASS = {
  'Sales Lead': styles.categoryAccent,
  Support: styles.categoryNeutral,
  Spam: styles.categoryMuted,
  Other: styles.categoryMuted,
};

const PRIORITY_CLASS = {
  High: styles.priorityHigh,
  Medium: styles.priorityMedium,
  Low: styles.priorityLow,
};

function timeAgo(isoString) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function EmailTriageDemo() {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function poll() {
      try {
        const data = await fetchEmailTriageFeed();
        if (!mounted.current) return;
        setEntries(data);
        setStatus('ready');
      } catch {
        if (!mounted.current) return;
        setStatus((prev) => (prev === 'ready' ? prev : 'error'));
      }
    }

    poll();
    const intervalId = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      mounted.current = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.inner}>
      <div className={styles.intro}>
        <p className={styles.introText}>
          Send an email to our live demo mailbox — an n8n + Gemini workflow classifies it in
          real time, replies with the result, and drops an anonymized entry into the feed
          below.
        </p>
        <a className={styles.mailboxLink} href={`mailto:${DEMO_MAILBOX}`}>
          {DEMO_MAILBOX}
        </a>
        <p className={styles.privacyNote}>
          The feed only ever shows category, priority, and a summary — sender identity is
          never stored or displayed.
        </p>
      </div>

      <div className={styles.feed} aria-live="polite">
        {status === 'loading' && <p className={styles.emptyState}>Loading live feed…</p>}
        {status === 'error' && (
          <p className={styles.emptyState}>Couldn't load the live feed right now — please try again shortly.</p>
        )}
        {status === 'ready' && entries.length === 0 && (
          <p className={styles.emptyState}>No emails classified yet — be the first to send one in!</p>
        )}
        {entries.map((entry, i) => (
          <div key={`${entry.created_at}-${i}`} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={`${styles.badge} ${CATEGORY_CLASS[entry.category] || styles.categoryMuted}`}>
                {entry.category}
              </span>
              <span className={`${styles.badge} ${PRIORITY_CLASS[entry.priority] || styles.priorityMedium}`}>
                {entry.priority}
              </span>
              <span className={styles.timestamp}>{timeAgo(entry.created_at)}</span>
            </div>
            <p className={styles.summary}>{entry.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

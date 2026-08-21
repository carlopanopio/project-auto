import { useDocTheme } from '../../hooks/useDocTheme.js';
import styles from './AirtableEmbed.module.css';

const AIRTABLE_EMBED_URL = import.meta.env.VITE_AIRTABLE_EMBED_URL || '';

export default function AirtableEmbed() {
  const theme = useDocTheme();

  if (!AIRTABLE_EMBED_URL) {
    return (
      <div className={styles.comingSoon}>
        <p>Live view coming soon — the Airtable board isn't public yet. Submit the form and imagine your name popping up here in real time!</p>
      </div>
    );
  }

  return (
    <iframe
      src={AIRTABLE_EMBED_URL}
      title="Live CRM Sync — Company field"
      className={`${styles.airtableFrame} ${theme === 'light' ? styles.light : ''}`}
    />
  );
}

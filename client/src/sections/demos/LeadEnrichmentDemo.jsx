import { useState } from 'react';
import { enrichDomain, N8nError } from '../../lib/n8n.js';
import styles from './LeadEnrichmentDemo.module.css';

// Basic domain shape check (e.g. acme.com, sub.acme.co.uk) — the n8n workflow
// does the authoritative validation, this is just fast client-side feedback.
const DOMAIN_RE = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i;

function normalizeDomain(value) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
}

export default function LeadEnrichmentDemo() {
  const [domain, setDomain] = useState('');
  const [domainError, setDomainError] = useState('');
  // Honeypot: real visitors never see or fill this field. A filled value
  // means a bot filled every input on the page — bail out silently.
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | rate_limited | error
  const [summary, setSummary] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setDomainError('');

    if (website) return;

    const clean = normalizeDomain(domain);
    if (!clean || !DOMAIN_RE.test(clean)) {
      setDomainError('Enter a valid domain, e.g. acme.com');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const data = await enrichDomain(clean);
      setSummary(data.summary);
      setStatus('success');
    } catch (err) {
      setStatus(err instanceof N8nError && err.kind === 'rate_limited' ? 'rate_limited' : 'error');
      setMessage(err.message);
    }
  }

  const loading = status === 'loading';

  return (
    <div className={styles.widget}>
      <p className={styles.intro}>
        Enter a company domain — a live n8n workflow looks it up and hands the raw fields to
        Gemini for a quick plain-English summary.
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="enrich-domain">Company domain</label>
          <input
            id="enrich-domain"
            className={styles.input}
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="acme.com"
            autoComplete="off"
            disabled={loading}
          />
          {domainError && <span className={styles.errorText}>{domainError}</span>}
        </div>

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="enrich-website">Website</label>
          <input
            id="enrich-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Looking up…' : 'Enrich domain'}
        </button>
      </form>

      {status === 'rate_limited' && <p className={styles.rateLimitNotice}>{message}</p>}
      {status === 'error' && <p className={styles.errorNotice}>{message}</p>}

      {status === 'success' && summary && (
        <div className={styles.resultCard}>
          <span className={styles.resultLabel}>Company summary</span>
          <p className={styles.resultText}>{summary}</p>
        </div>
      )}
    </div>
  );
}

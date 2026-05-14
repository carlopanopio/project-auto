import { useEffect, useState } from 'react';
import { getCertifications } from '../lib/api.js';
import styles from './Certifications.module.css';

const PROVIDER_ACCENT = {
  Anthropic:   '#d97a4a',
  Google:      '#4285f4',
  Atlassian:   '#0052cc',
  GoHighLevel: '#f9a825',
  ISO:         '#64748b',
};

function ProviderIcon({ provider }) {
  if (provider === 'Anthropic') return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <polygon points="13,3 23,21 3,21" fill="#d97a4a" opacity="0.85" />
    </svg>
  );
  if (provider === 'Google') return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M22 13.5c0-.7-.06-1.36-.17-2H13v3.78h5.04a4.3 4.3 0 01-1.87 2.82v2.34h3.02C21.02 18.65 22 16.25 22 13.5z" fill="#4285f4"/>
      <path d="M13 23c2.52 0 4.64-.84 6.19-2.26l-3.02-2.34c-.84.56-1.91.9-3.17.9-2.44 0-4.5-1.64-5.24-3.85H4.66v2.41A9.5 9.5 0 0013 23z" fill="#34a853"/>
      <path d="M7.76 15.45A5.7 5.7 0 017.46 13.5c0-.68.12-1.34.3-1.95V9.14H4.66A9.5 9.5 0 003.5 13.5c0 1.53.37 2.98 1.16 4.26l3.1-2.31z" fill="#fbbc05"/>
      <path d="M13 7.7c1.38 0 2.61.47 3.58 1.4l2.68-2.68A9.47 9.47 0 0013 4a9.5 9.5 0 00-8.34 4.94l3.1 2.41C8.5 9.14 10.56 7.7 13 7.7z" fill="#ea4335"/>
    </svg>
  );
  if (provider === 'Atlassian') return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M5.5 20.5C8.2 15 10.5 11 13 7c2.5 4 4.8 8 7.5 13.5H5.5z" stroke="#0052cc" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <path d="M8.5 15.5C10 13 11.5 11 13 9c1.5 2 3 4 4.5 6.5H8.5z" fill="#0052cc" opacity="0.5"/>
    </svg>
  );
  if (provider === 'GoHighLevel') return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="18" height="18" rx="4" stroke="#f9a825" strokeWidth="2"/>
      <path d="M9.5 13L13 9.5L16.5 13L13 16.5Z" fill="#f9a825"/>
    </svg>
  );
  if (provider === 'ISO') return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="4" y="9" width="18" height="8" rx="2" stroke="#64748b" strokeWidth="2"/>
      <line x1="9" y1="9" x2="9" y2="5" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="17" y1="9" x2="17" y2="5" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="8" stroke="#94a3b8" strokeWidth="2"/>
    </svg>
  );
}

const FALLBACK = [
  { id: 1,  title: 'GoHighLevel Certified Specialist',    provider: 'GoHighLevel', issued_date: null },
  { id: 2,  title: 'Claude 101',                          provider: 'Anthropic',   issued_date: 'Apr 2026' },
  { id: 3,  title: 'Introduction to Claude Cowork',       provider: 'Anthropic',   issued_date: 'Apr 2026' },
  { id: 4,  title: 'Claude Code in Action',               provider: 'Anthropic',   issued_date: 'Apr 2026' },
  { id: 5,  title: 'Claude Code 101',                     provider: 'Anthropic',   issued_date: 'Apr 2026' },
  { id: 6,  title: 'Agile with Atlassian Jira',           provider: 'Atlassian',   issued_date: null },
  { id: 7,  title: 'Python Programming',                  provider: 'Google',      issued_date: null },
  { id: 8,  title: 'Git & GitHub',                        provider: 'Google',      issued_date: null },
  { id: 9,  title: 'AI Prototyping (Google AI Studio)',   provider: 'Google',      issued_date: null },
  { id: 10, title: 'ISO 20001 & 9001 Compliant Development', provider: 'ISO',     issued_date: null },
];

export default function Certifications() {
  const [certs, setCerts] = useState(FALLBACK);

  useEffect(() => {
    getCertifications()
      .then((data) => { if (data.length) setCerts(data); })
      .catch(() => {});
  }, []);

  return (
    <section id="certifications" className={`section ${styles.certifications}`}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <h2 className={styles.heading}>
            Credentials &<br />
            <span className="gradient-text">certifications</span>
          </h2>
          <p className={styles.sub}>
            Formal recognition from the platforms and providers we work with daily —
            from AI tooling to cloud infrastructure and agile delivery.
          </p>
        </div>

        <div className={styles.grid}>
          {certs.map((c, i) => {
            const accent = PROVIDER_ACCENT[c.provider] || '#64748b';
            return (
              <div
                key={c.id}
                className={`${styles.card} reveal reveal-delay-${(i % 3) + 1}`}
                style={{ '--accent': accent }}
              >
                <span className={styles.cardIcon}>
                  <ProviderIcon provider={c.provider} />
                </span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardProvider}>{c.provider}</p>
                {c.issued_date && (
                  <span className={styles.dateBadge}>{c.issued_date}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

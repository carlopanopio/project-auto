import { useState, useEffect } from 'react';
import styles from './Contact.module.css';

const CALENDAR_URL = 'https://api.leadconnectorhq.com/widget/bookings/automationhubph-disc-call';

function useDocTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

export default function Contact() {
  const theme = useDocTheme();

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className="container">
        <div className={styles.inner}>
          <div className={`${styles.left} reveal`}>
            <span className={styles.label}>Book a Call</span>
            <h2 className={styles.heading}>
              Let's map out your <span className="gradient-text">automation roadmap</span>
            </h2>
            <p className={styles.sub}>
              Pick a time that works for you. In 30 minutes we'll identify your biggest
              bottlenecks and walk through what's possible — no fluff, no lock-in.
            </p>
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6z"/>
                  <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
                </svg>
                hello@automationhub.ph
              </div>
              <div className={styles.infoItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                30-minute discovery call
              </div>
              <div className={styles.infoItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Pick any available slot below
              </div>
            </div>
          </div>

          <div className={`${styles.calendarWrapper} reveal reveal-delay-2`}>
            <iframe
              src={CALENDAR_URL}
              id="msgsndr-calendar"
              title="Book a Discovery Call"
              scrolling="yes"
              className={`${styles.calendarFrame} ${theme === 'light' ? styles.light : ''}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

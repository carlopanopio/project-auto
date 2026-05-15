import { useEffect, useRef } from 'react';
import styles from './Contact.module.css';

const CALENDAR_URL = 'https://api.leadconnectorhq.com/widget/bookings/automationhubph-disc-call';

function sendTheme(iframe, theme) {
  iframe?.contentWindow?.postMessage({ type: 'ah-theme', theme }, '*');
}

export default function Contact() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    // Send theme whenever the site's data-theme attribute changes
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      sendTheme(iframe, theme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Respond to the iframe requesting the current theme on its load
    function handleRequest(e) {
      if (e.data?.type === 'ah-theme-request') {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        sendTheme(iframe, theme);
      }
    }
    window.addEventListener('message', handleRequest);

    // Push theme once iframe has loaded
    function onLoad() {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      sendTheme(iframe, theme);
    }
    iframe?.addEventListener('load', onLoad);

    return () => {
      observer.disconnect();
      window.removeEventListener('message', handleRequest);
      iframe?.removeEventListener('load', onLoad);
    };
  }, []);

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
              ref={iframeRef}
              src={CALENDAR_URL}
              id="msgsndr-calendar"
              title="Book a Discovery Call"
              scrolling="yes"
              className={styles.calendarFrame}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { useDocTheme } from '../hooks/useDocTheme.js';
import styles from './Contact.module.css';

const CALENDAR_URL = 'https://api.leadconnectorhq.com/widget/bookings/automationhubph-disc-call';

export default function Contact() {
  const theme = useDocTheme();

  return (
    <section id="contact" className={`section ${styles.contact}`} data-anchor>
      <div className={`layer ${styles.glow}`} data-speed="0.15" />
      <div className={`container ${styles.inner}`} data-split>
        <div className={styles.left}>
          <p className="eyebrow">Book a call</p>
          <h2 className="h2">Let's map out your <span className="gradient-text">automation roadmap</span></h2>
          <p className={`lede ${styles.sub}`}>
            Pick a time that works for you. In 30 minutes we'll identify your biggest
            bottlenecks and walk through what's possible — no fluff, no lock-in.
          </p>
          <div className={styles.meta}>
            <span>hello@automationhub.ph</span>
            <span>30-minute discovery call</span>
            <span>fixed-price quotes</span>
          </div>
        </div>

        <div className={styles.calendarWrapper}>
          <iframe
            src={CALENDAR_URL}
            id="msgsndr-calendar"
            title="Book a Discovery Call"
            scrolling="yes"
            className={`${styles.calendarFrame} ${theme === 'light' ? styles.light : ''}`}
          />
        </div>
      </div>
    </section>
  );
}

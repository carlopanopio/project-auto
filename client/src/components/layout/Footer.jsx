import { LogoMark } from './Navbar.jsx';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.logo}>
          <LogoMark />
          AutomationHub
        </span>
        <p className={styles.copy}>© {year} AutomationHub.ph · Built for the future of work.</p>
        <p className={styles.tagline}>automationhub.ph</p>
      </div>
    </footer>
  );
}

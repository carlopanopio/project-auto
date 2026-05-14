import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          AutomationHub
        </div>
        <p className={styles.copy}>
          © {year} AutomationHub.ph · Built for the future of work.
        </p>
        <p className={styles.tagline}>automationhub.ph</p>
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#portfolio' },
  { label: 'Live demos', href: '#demos' },
  { label: 'Process', href: '#process' },
  { label: 'Experience', href: '#experience' },
  { label: 'Ask me anything', href: '#interview' },
  { label: 'Credentials', href: '#certifications' },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
    </svg>
  );
}

export function LogoMark() {
  return (
    <svg className={styles.logoMark} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="5" cy="11" r="3" fill="var(--color-accent)"/>
      <circle cx="17" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="17" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7.6 9.6 14.8 5.9M7.6 12.4l7.2 3.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    const mq = window.matchMedia('(min-width: 961px)');
    const onChange = (e) => { if (e.matches) setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  function scrollTo(href) {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ''} ${menuOpen ? styles.navOpen : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.logo} href="/" aria-label="AutomationHub">
          <LogoMark />
          AutomationHub
        </a>

        <nav id="nav-links" className={styles.links} aria-label="Sections">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <button
            type="button"
            className="icon-btn"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button type="button" className={`btn btn-primary ${styles.cta}`} onClick={() => scrollTo('#contact')}>
            Book a call
          </button>
          <button
            type="button"
            className={`icon-btn ${styles.menuBtn}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="nav-links"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

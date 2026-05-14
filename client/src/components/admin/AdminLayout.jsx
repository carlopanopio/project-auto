import { useState } from 'react';
import { clearToken } from '../../lib/auth.js';
import ProjectsEditor from './ProjectsEditor.jsx';
import ServicesEditor from './ServicesEditor.jsx';
import ExperienceEditor from './ExperienceEditor.jsx';
import TestimonialsEditor from './TestimonialsEditor.jsx';
import CertificationsEditor from './CertificationsEditor.jsx';
import styles from './Admin.module.css';

const TABS = [
  { key: 'projects', label: 'Projects' },
  { key: 'services', label: 'Services' },
  { key: 'experience', label: 'Experience' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'certifications', label: 'Certifications' },
];

export default function AdminLayout({ onLogout }) {
  const [tab, setTab] = useState('projects');

  function handleLogout() {
    clearToken();
    onLogout();
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoDot} />
          Admin Panel
        </div>
        <nav className={styles.nav}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.navLink} ${tab === t.key ? styles.navLinkActive : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      <main className={styles.main}>
        {tab === 'projects' && <ProjectsEditor />}
        {tab === 'services' && <ServicesEditor />}
        {tab === 'experience' && <ExperienceEditor />}
        {tab === 'testimonials' && <TestimonialsEditor />}
        {tab === 'certifications' && <CertificationsEditor />}
      </main>
    </div>
  );
}

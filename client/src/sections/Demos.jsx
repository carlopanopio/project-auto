import { useState, useRef, useEffect } from 'react';
import ContentRepurposer from './demos/ContentRepurposer.jsx';
import ChatWidget from './demos/ChatWidget.jsx';
import CrmSyncDemo from './demos/CrmSyncDemo.jsx';
import EmailTriageDemo from './demos/EmailTriageDemo.jsx';
import styles from './Demos.module.css';

const TABS = [
  { id: 'repurpose', label: 'Content Repurposer' },
  { id: 'chat', label: 'Ask Anything' },
  { id: 'crm', label: 'CRM Sync' },
  { id: 'triage', label: 'Email Triage' },
];

export default function Demos() {
  const [activeTab, setActiveTab] = useState('repurpose');
  const panelRef = useRef(null);
  const mounted = useRef(false);

  // The global scroll-reveal IntersectionObserver only fires once per element on
  // initial scroll-into-view, so a panel swapped in after mount (via tab click)
  // would otherwise stay stuck at opacity:0 — force it visible, same workaround
  // Portfolio.jsx uses for its filter clicks.
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    panelRef.current?.classList.add('visible');
  }, [activeTab]);

  return (
    <section id="demos" className={`section ${styles.demos}`}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <span className="overline">Try It Yourself</span>
          <h2 className={styles.heading}>
            See the automations<br />
            <span className="gradient-text">actually run</span>
          </h2>
          <p className={styles.sub}>
            These demos are wired to real, live automations — same n8n workflows I build for clients.
          </p>

          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={panelRef} className={`${styles.panel} reveal reveal-delay-1`}>
          {activeTab === 'repurpose' && <ContentRepurposer />}
          {activeTab === 'chat' && <ChatWidget />}
          {activeTab === 'crm' && <CrmSyncDemo />}
          {activeTab === 'triage' && <EmailTriageDemo />}
        </div>
      </div>
    </section>
  );
}

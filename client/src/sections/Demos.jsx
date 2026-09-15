import { useState } from 'react';
import ContentRepurposer from './demos/ContentRepurposer.jsx';
import ChatWidget from './demos/ChatWidget.jsx';
import CrmSyncDemo from './demos/CrmSyncDemo.jsx';
import EmailTriageDemo from './demos/EmailTriageDemo.jsx';
import LeadEnrichmentDemo from './demos/LeadEnrichmentDemo.jsx';
import styles from './Demos.module.css';

const TABS = [
  { id: 'repurpose', label: 'Content Repurposer' },
  { id: 'chat', label: 'Ask Anything' },
  { id: 'crm', label: 'CRM Sync' },
  { id: 'triage', label: 'Email Triage' },
  { id: 'enrich', label: 'Lead Enrichment' },
];

export default function Demos() {
  const [activeTab, setActiveTab] = useState('repurpose');

  return (
    <section id="demos" className="section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="eyebrow">Try it yourself</p>
            <h2 className="h2">See the automations <span className="gradient-text">actually run</span></h2>
          </div>
          <p className={`lede ${styles.sub}`}>
            These demos are wired to real, live automations — the same n8n workflows we build for clients.
            Pick one and watch it execute.
          </p>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Live demos">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          {activeTab === 'repurpose' && <ContentRepurposer />}
          {activeTab === 'chat' && <ChatWidget />}
          {activeTab === 'crm' && <CrmSyncDemo />}
          {activeTab === 'triage' && <EmailTriageDemo />}
          {activeTab === 'enrich' && <LeadEnrichmentDemo />}
        </div>
      </div>
    </section>
  );
}

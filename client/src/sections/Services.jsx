import { useEffect, useState } from 'react';
import { getServices } from '../lib/api.js';
import styles from './Services.module.css';

const SERVICE_TAGS = {
  'GoHighLevel Custom Setup & Integrations': ['GoHighLevel', 'Webhooks', 'n8n', 'Make.com'],
  'Custom API & Payment Gateway Integration': ['REST API', 'PayMongo', 'Node.js', 'GCash', 'Maya'],
  'Workflow Automation Consulting': ['n8n', 'Make.com', 'Zapier', 'AI tools'],
  'QA & Integration Testing': ['Test Plans', 'JIRA', 'Edge cases', 'Load testing'],
  'Software Development': ['React', 'Node.js', 'Python', 'Docker', 'Railway'],
};

const FALLBACK = [
  { id: 1, title: 'GoHighLevel Custom Setup & Integrations', description: 'Beyond standard GHL setups — custom sub-account architectures, advanced workflow logic, white-label portals, and API-level integrations that the drag-and-drop builder can\'t reach.' },
  { id: 2, title: 'Custom API & Payment Gateway Integration', description: 'PayMongo, GCash, Maya, Stripe — integrated directly into your CRM or ops stack with bulletproof webhook handling, retry logic, and real-time reconciliation.' },
  { id: 3, title: 'Workflow Automation Consulting', description: 'n8n, Make.com, or Zapier — we design and build automation flows that eliminate manual work without creating brittle single points of failure.' },
  { id: 4, title: 'QA & Integration Testing', description: 'Every integration is tested against failure states, bad payloads, and edge cases using the same QA discipline applied in enterprise software development.' },
  { id: 5, title: 'Software Development', description: 'Full-stack development for custom internal tools, client portals, and automation dashboards — built to production quality and maintained like real software.' },
];

export default function Services() {
  const [services, setServices] = useState(FALLBACK);

  useEffect(() => {
    getServices().then((data) => { if (data.length) setServices(data); }).catch(() => {});
  }, []);

  return (
    <section id="services" className={`section ${styles.services}`}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <h2 className={styles.heading}>
            What we<br />
            <span className="gradient-text">actually do</span>
          </h2>
          <div className={styles.headerRight}>
            <p className={styles.sub}>
              Most GHL consultants are marketers who learned the platform.
              We're software engineers who chose to specialise in it — which means
              we can build things others can't touch.
            </p>
          </div>
        </div>

        <div className={styles.list}>
          {services.map((s, i) => (
            <div key={s.id} className={`${styles.item} reveal reveal-delay-${Math.min(i + 1, 4)}`}>
              <span className={styles.num}>0{i + 1}</span>
              <div className={styles.body}>
                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.desc}>{s.description}</p>
                <div className={styles.tags}>
                  {(SERVICE_TAGS[s.title] || []).map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </div>
              <div className={styles.arrow}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

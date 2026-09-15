import { useEffect, useState } from 'react';
import { getExperience } from '../lib/api.js';
import styles from './Experience.module.css';

const FALLBACK = [
  { id: 1, role: 'Freelance Software Engineer & Automation Specialist', company: 'AutomationHub.ph', period: '2023 – Present', bullets: ['GoHighLevel CRM buildouts, custom integrations, and advanced webhook automations', 'Custom API and payment gateway integrations (PayMongo, GCash, Maya, Stripe)', 'Workflow automation using n8n, Make.com, Zapier, and custom Node.js/Python', 'GHL Certified Specialist · 100% job success rate on Upwork'] },
  { id: 2, role: 'Software Engineer', company: 'Financial Services', period: '2023 – Present', bullets: ['Full-stack development across React, Node.js, and cloud infrastructure', 'ISO 20001/9001 compliant development practices'] },
  { id: 3, role: 'Software Design Specialist', company: 'Energy Market Sector', period: '2018 – 2023', bullets: ['Designed and maintained software systems for Philippine electricity market infrastructure', 'Worked within regulated, high-availability enterprise environments'] },
  { id: 4, role: 'Software Test Engineer', company: 'Energy Market Sector', period: '2013 – 2018', bullets: ['5 years dedicated QA engineering in regulated energy-sector systems', 'Test plans, edge case coverage, JIRA-tracked issue resolution, and load testing'] },
  { id: 5, role: '.NET Developer', company: 'Energy Sector', period: '2011 – 2013', bullets: ['Enterprise .NET development in the energy sector'] },
];

function yearSpan(entries) {
  const years = entries.flatMap((e) => (e.period || '').match(/\d{4}/g) || []).map(Number);
  if (!years.length) return null;
  return { from: Math.min(...years), to: Math.max(...years, new Date().getFullYear()) };
}

export default function Experience() {
  const [entries, setEntries] = useState(FALLBACK);

  useEffect(() => {
    getExperience().then((data) => { if (data.length) setEntries(data); }).catch(() => {});
  }, []);

  const span = yearSpan(entries);

  return (
    <section id="experience" className={`section ${styles.exp}`} data-anchor>
      {span && (
        <div className={`layer ${styles.years}`} data-speed="0.25" aria-hidden="true">
          {span.from}<br />{span.to}
        </div>
      )}
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">Experience</p>
          <h2 className="h2">Fifteen years, <span className="gradient-text">regulated</span> to freelance</h2>
          <p className={`lede ${styles.sub}`}>
            Software engineering, QA and automation — from Philippine energy-market
            infrastructure to custom integrations for agencies and service businesses.
          </p>
        </div>

        <div className={styles.timeline}>
          {entries.map((e) => (
            <div key={e.id} className={styles.row}>
              <div className={styles.when}>{e.period}</div>
              <div className={styles.body}>
                <h3 className={styles.role}>{e.role}</h3>
                <p className={styles.company}>{e.company}</p>
                {(e.bullets || []).length > 0 && (
                  <ul className={styles.bullets}>
                    {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

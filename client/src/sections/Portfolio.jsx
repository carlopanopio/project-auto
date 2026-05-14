import { useEffect, useState } from 'react';
import { getProjects } from '../lib/api.js';
import styles from './Portfolio.module.css';

const FALLBACK = [
  { id: 1, title: 'PayMongo + GoHighLevel', description: 'Philippine agencies processing GCash and Maya payments were spending 15–20 minutes per transaction on manual matching, invoice generation, and onboarding triggers. Built a Node.js webhook bridge that intercepts PayMongo payment events and fires GHL automations — contact creation, opportunity updates, invoices, SMS/email sequences — in under 3 seconds.', tags: ['GoHighLevel', 'Node.js', 'PayMongo', 'Railway', 'Docker'], results: '15h+ saved weekly · zero reconciliation errors · <3s end-to-end' },
  { id: 2, title: 'SmashMatch Court Queue Manager', description: 'Staff at a busy badminton facility were managing court queues with pen and paper — double-bookings, disputes, and significant manual coordination during peak hours. Built a real-time React web app with a live court status board, digital queue management, and walk-in registration on a single dashboard — no app install required for customers.', tags: ['React', 'Node.js', 'WebSockets'], results: '60% staff workload reduction · zero double-bookings since launch' },
  { id: 3, title: 'SnowPros Business Website', description: 'Designed and built a complete business website for a Canadian snow removal company. Custom WordPress theme with service area pages optimised for local SEO, a quote request form connected to email notifications, and a mobile-first layout built to rank in the markets they serve.', tags: ['WordPress', 'PHP', 'Fluent Forms', 'Local SEO'], results: 'Full local SEO optimisation · mobile-first · quote form automation' },
  { id: 4, title: 'Playwithbella Shopify Store', description: 'Built a conversion-optimised Shopify storefront for a children\'s toy brand with custom product page layouts, a sticky add-to-cart bar, and collection filtering. Focused on reducing friction between browse and checkout for a mobile-first customer base.', tags: ['Shopify', 'Liquid', 'Conversion Optimisation'], results: 'Reduced browse-to-checkout friction · mobile-first UX · custom product layouts' },
];

export default function Portfolio() {
  const [projects, setProjects] = useState(FALLBACK);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getProjects().then((data) => { if (data.length) setProjects(data); }).catch(() => {});
  }, []);

  const allTags = ['All', ...new Set(projects.flatMap((p) => p.tags || []))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tags?.includes(filter));

  return (
    <section id="portfolio" className={`section ${styles.portfolio}`}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <h2 className={styles.heading}>
            Work that<br />
            <span className="gradient-text">speaks for itself</span>
          </h2>
          <p className={styles.sub}>
            Real integrations, real outcomes — every project built to run without hand-holding.
          </p>

          {allTags.length > 2 && (
            <div className={styles.filters}>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`${styles.filterBtn} ${filter === tag ? styles.filterActive : ''}`}
                  onClick={() => setFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.grid}>
          {filtered.map((p, i) => (
            <article key={p.id} className={`${styles.card} reveal reveal-delay-${(i % 2) + 1}`}>
              <div className={`${styles.cardBand} ${styles[`cardBand${i % 5}`]}`} />
              <div className={styles.cardInner}>
                <div className={styles.cardTop}>
                  {(p.tags || []).map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardDesc}>{p.description}</p>
                {p.results && (
                  <div className={styles.results}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                    </svg>
                    {p.results}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

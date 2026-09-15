import { useEffect, useState } from 'react';
import { getProjects } from '../lib/api.js';
import styles from './Portfolio.module.css';

const FALLBACK = [
  { id: 1, title: 'PayMongo + GoHighLevel', description: 'Philippine agencies processing GCash and Maya payments were spending 15–20 minutes per transaction on manual matching, invoice generation, and onboarding triggers. Built a Node.js webhook bridge that intercepts PayMongo payment events and fires GHL automations — contact creation, opportunity updates, invoices, SMS/email sequences — in under 3 seconds.', tags: ['GoHighLevel', 'Node.js', 'PayMongo', 'Railway', 'Docker'], results: '15h+ saved weekly · zero reconciliation errors · <3s end-to-end' },
  { id: 2, title: 'SmashMatch Court Queue Manager', description: 'Staff at a busy badminton facility were managing court queues with pen and paper — double-bookings, disputes, and significant manual coordination during peak hours. Built a real-time React web app with a live court status board, digital queue management, and walk-in registration on a single dashboard — no app install required for customers.', tags: ['React', 'Node.js', 'WebSockets'], results: '60% staff workload reduction · zero double-bookings since launch' },
  { id: 3, title: 'SnowPros Business Website', description: 'Designed and built a complete business website for a Canadian snow removal company. Custom WordPress theme with service area pages optimised for local SEO, a quote request form connected to email notifications, and a mobile-first layout built to rank in the markets they serve.', tags: ['WordPress', 'PHP', 'Fluent Forms', 'Local SEO'], results: 'Full local SEO optimisation · mobile-first · quote form automation' },
  { id: 4, title: 'Playwithbella Shopify Store', description: 'Built a conversion-optimised Shopify storefront for a children\'s toy brand with custom product page layouts, a sticky add-to-cart bar, and collection filtering. Focused on reducing friction between browse and checkout for a mobile-first customer base.', tags: ['Shopify', 'Liquid', 'Conversion Optimisation'], results: 'Reduced browse-to-checkout friction · mobile-first UX · custom product layouts' },
];

/**
 * A schematic drawn from the project's own tags: up to three nodes wired in
 * sequence. It sits inside a clipped window and moves slower than the card,
 * which gives the "looking through" parallax depth.
 */
function Scene({ tags, index }) {
  const nodes = (tags || []).slice(0, 3);
  const n = nodes.length || 1;
  const w = 400;
  const boxW = n === 1 ? 160 : 108;
  const gap = n > 1 ? (w - 80 - n * boxW) / (n - 1) : 0;
  const y = 130;
  const strokes = ['var(--color-accent)', 'var(--color-violet)', 'var(--color-gold)'];
  const patternId = `grid-${index}`;

  return (
    <svg className={styles.scene} viewBox="0 0 400 380" aria-hidden="true">
      <defs>
        <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0v24" fill="none" stroke="var(--color-grid)" />
        </pattern>
      </defs>
      <rect width="400" height="380" fill={`url(#${patternId})`} />
      {nodes.map((tag, i) => {
        const x = 40 + i * (boxW + gap);
        return (
          <g key={tag}>
            {i > 0 && (
              <path d={`M${x - gap} ${y + 26}h${gap}`} stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="6 5" />
            )}
            <rect x={x} y={y} width={boxW} height="52" rx="8" fill="var(--color-surface)" stroke={strokes[i]} />
            <text x={x + boxW / 2} y={y + 31} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="var(--color-text)">
              {tag.length > 14 ? `${tag.slice(0, 13)}…` : tag}
            </text>
          </g>
        );
      })}
      {nodes.length === 0 && (
        <rect x="40" y={y} width="320" height="52" rx="8" fill="var(--color-surface)" stroke="var(--color-accent)" />
      )}
      <text x="40" y="226" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="var(--color-muted)">
        {`run #${(4800 + index * 37).toLocaleString()} · ok`}
      </text>
    </svg>
  );
}

function Card({ p, index }) {
  return (
    <article className={styles.card}>
      <div className={styles.window}>
        <div className={styles.sceneLayer} data-speed="0.1">
          <Scene tags={p.tags} index={index} />
        </div>
      </div>
      <div className={styles.body}>
        {(p.tags || []).length > 0 && (
          <div className="tags">
            {p.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
        <h3 className={styles.title}>{p.title}</h3>
        <p className={styles.desc}>{p.description}</p>
        {p.results && (
          <div className={styles.results}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 6 13.5 15.5l-5-5L1 18M17 6h6v6"/></svg>
            {p.results}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [projects, setProjects] = useState(FALLBACK);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getProjects().then((data) => { if (data.length) setProjects(data); }).catch(() => {});
  }, []);

  const allTags = ['All', ...new Set(projects.flatMap((p) => p.tags || []))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tags?.includes(filter));
  const colA = filtered.filter((_, i) => i % 2 === 0);
  const colB = filtered.filter((_, i) => i % 2 === 1);

  return (
    <section id="portfolio" className="section section-alt">
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="h2">Work that <span className="gradient-text">runs</span> without hand-holding</h2>
          </div>
          <p className={`lede ${styles.sub}`}>
            Real integrations, real outcomes — each one built, tested and documented like production software.
          </p>
        </div>

        {allTags.length > 2 && (
          <div className={styles.filters}>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`${styles.filterBtn} ${filter === tag ? styles.filterActive : ''}`}
                onClick={() => setFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className={styles.grid} data-split>
          <div className={styles.col}>
            {colA.map((p, i) => <Card key={p.id} p={p} index={i * 2} />)}
          </div>
          <div className={`${styles.col} ${styles.colB}`}>
            {colB.map((p, i) => <Card key={p.id} p={p} index={i * 2 + 1} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

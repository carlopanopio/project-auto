import { useEffect, useState } from 'react';
import { getTestimonials } from '../lib/api.js';
import styles from './Testimonials.module.css';

const FALLBACK = [
  { id: 1, client_name: 'Ryan M.', client_title: 'Agency Owner · SnowPros', body: 'I\'ve worked with GHL consultants who knew marketing funnels and others who knew code. AutomationHub is the first team I\'ve found that genuinely knows both. They built a payment sync that our previous developer said was impossible.', rating: 5 },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(FALLBACK);
  const [active, setActive] = useState(0);

  useEffect(() => {
    getTestimonials().then((data) => { if (data.length) { setTestimonials(data); setActive(0); } }).catch(() => {});
  }, []);

  const t = testimonials[Math.min(active, testimonials.length - 1)];

  return (
    <section id="testimonials" className={`section section-alt ${styles.quote}`} data-anchor>
      <div className={`layer ${styles.mark}`} data-speed="0.2" aria-hidden="true">“</div>
      <div className={`container ${styles.inner}`} data-split>
        <div>
          <p className="eyebrow">Clients</p>
          <h2 className="h2">What clients <span className="gradient-text">actually</span> say</h2>

          {testimonials.length > 1 && (
            <div className={styles.nav} role="tablist" aria-label="Testimonials">
              {testimonials.map((item, i) => (
                <button
                  key={item.id ?? i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={`${styles.navDot} ${i === active ? styles.navDotActive : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <blockquote className={styles.body}>{t.body}</blockquote>
          <div className={styles.who}>
            <div className={styles.avatar} aria-hidden="true">{t.client_name?.[0]}</div>
            <div>
              <div className={styles.name}>{t.client_name}</div>
              {t.client_title && <div className={styles.title}>{t.client_title}</div>}
              <div className={styles.stars} aria-label={`${t.rating || 5} out of 5 stars`}>{'★'.repeat(t.rating || 5)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

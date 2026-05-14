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
    getTestimonials().then((data) => { if (data.length) setTestimonials(data); }).catch(() => {});
  }, []);
  const t = testimonials[active];

  return (
    <section id="testimonials" className={`section ${styles.testimonials}`}>
      <div className="container">
        <div className={styles.inner}>
          <div className={`${styles.left} reveal`}>
            <h2 className={styles.heading}>
              What clients<br />
              <span className="gradient-text">actually say</span>
            </h2>

            {testimonials.length > 1 && (
              <div className={styles.nav}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.navDot} ${i === active ? styles.navDotActive : ''}`}
                    onClick={() => setActive(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={`${styles.quoteWrap} reveal reveal-delay-2`}>
            <div className={styles.quoteMark}>"</div>
            <blockquote className={styles.quote}>
              {t.body}
            </blockquote>
            <div className={styles.author}>
              <div className={styles.avatar}>{t.client_name[0]}</div>
              <div>
                <div className={styles.authorName}>{t.client_name}</div>
                {t.client_title && <div className={styles.authorTitle}>{t.client_title}</div>}
                <div className={styles.stars}>{'★'.repeat(t.rating || 5)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

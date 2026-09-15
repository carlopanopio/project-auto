import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const tiltRef = useRef(null);

  // Pointer tilt on the card stack — fine pointers only, never under reduced motion
  useEffect(() => {
    const hero = heroRef.current;
    const tilt = tiltRef.current;
    if (!hero || !tilt) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      tilt.style.setProperty('--mx', (-mx).toFixed(3));
      tilt.style.setProperty('--my', (-my).toFixed(3));
    };
    const onLeave = () => {
      tilt.style.setProperty('--mx', '0');
      tilt.style.setProperty('--my', '0');
    };
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    return () => {
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  function scrollTo(id) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section id="hero" ref={heroRef} className={styles.hero} data-anchor>
      <div className={`layer ${styles.grid}`} data-speed="0.18" />
      <div className={`layer ${styles.orbA}`} data-speed="0.3" />
      <div className={`layer ${styles.orbB}`} data-speed="0.22" />

      <div className={`container ${styles.inner}`} data-split>
        <div className={styles.content}>
          <p className={`eyebrow ${styles.eyebrow}`}>15+ years engineering · Philippines</p>

          <h1 className={styles.heading}>
            We build <span className="gradient-text">integrations</span>{' '}
            <span className={styles.thin}>typical consultants</span> can't.
          </h1>

          <p className={`lede ${styles.lede}`}>
            Full-stack automation for agencies and service businesses — custom API connections,
            advanced GoHighLevel workflows, and no-code systems backed by a software engineering background.
          </p>

          <div className={styles.actions}>
            <button type="button" className="btn btn-primary" onClick={() => scrollTo('#portfolio')}>
              See the work <ArrowIcon />
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => scrollTo('#contact')}>
              Book a free audit
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>15+</div><div className={styles.statLabel}>years in software</div></div>
            <div className={styles.stat}><div className={styles.statNum}>15h+</div><div className={styles.statLabel}>saved per client weekly</div></div>
            <div className={styles.stat}><div className={styles.statNum}>100%</div><div className={styles.statLabel}>job success rate</div></div>
          </div>
        </div>

        <div className={styles.stack} aria-label="Sample automation run">
          <div ref={tiltRef} className={styles.tilt}>
            <div className={`${styles.card} ${styles.cardLog}`} data-speed="-0.05">
              <div className={styles.req}>
                <span><b>POST</b> /webhooks/paymongo</span>
                <span className={styles.ok}>200 · 2.4s</span>
              </div>
              <div className={styles.ev}><span className={styles.key}>payment.paid</span> · GCash · <span className={styles.amt}>₱4,500.00</span></div>
              <div className={styles.out}>GHL contact created</div>
              <div className={styles.out}>opportunity → “Paid”</div>
              <div className={styles.out}>invoice emailed · SMS queued</div>
            </div>

            <div className={`${styles.card} ${styles.cardSaved}`} data-speed="-0.12">
              <div className={styles.lbl}>Manual work removed</div>
              <div className={styles.big}>15h+ <small>per client · weekly</small></div>
              <div className={styles.bar}><i /></div>
            </div>

            <div className={`${styles.card} ${styles.cardCert}`} data-speed="-0.2">
              <span className={styles.dot} aria-hidden="true" />
              <div>
                <div className={styles.certTitle}>GHL Certified Specialist</div>
                <div className={styles.certSub}>100% job success on Upwork</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

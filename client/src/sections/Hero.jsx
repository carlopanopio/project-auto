import styles from './Hero.module.css';

function GeometricVisual() {
  return (
    <div className={styles.visual}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.grid}>
        <div className={styles.gridFade} />
      </div>

      <div className={styles.cards}>
        <div className={styles.card1}>
          <div className={styles.card1Label}>Automation trigger</div>
          <div className={styles.card1Value}>15h+ saved</div>
          <div className={styles.card1Sub}>per client · weekly average</div>
          <div className={styles.card1Bar}>
            <div className={styles.card1BarFill} />
          </div>
        </div>

        <div className={styles.cardRow}>
          <div className={styles.card2}>
            <div className={styles.card2Dot} />
            <div>
              <div className={styles.card2Text}>PayMongo → GHL</div>
              <div className={styles.card2Sub}>Webhook fired · 2.4s</div>
            </div>
          </div>

          <div className={styles.card3}>
            <div className={styles.card3Row}>GHL Certified Specialist</div>
            <span className={styles.card3Tag}>✓ 100% Job Success</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  function scrollTo(id) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section id="hero">
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.content}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              <span className={styles.eyebrowText}>15+ years engineering · Philippines</span>
            </div>

            <h1 className={styles.heading}>
              We build<br />
              <span className="gradient-text">integrations</span><br />
              <span className={styles.headingItalic}>typical consultants</span><br />
              can't.
            </h1>

            <p className={styles.sub}>
              Full-stack automation for agencies and service businesses — custom API connections,
              advanced GoHighLevel workflows, and no-code systems backed by a software engineering background.
            </p>

            <div className={styles.actions}>
              <button className={styles.btnPrimary} onClick={() => scrollTo('#portfolio')}>
                View Our Work
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className={styles.btnSecondary} onClick={() => scrollTo('#contact')}>
                Book a free audit
              </button>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNum}>15+</div>
                <div className={styles.statLabel}>Years in<br />software</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNum}>15h+</div>
                <div className={styles.statLabel}>Saved per<br />client weekly</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNum}>100%</div>
                <div className={styles.statLabel}>Job success<br />rate</div>
              </div>
            </div>
          </div>

          <GeometricVisual />
        </div>
      </div>
    </section>
  );
}

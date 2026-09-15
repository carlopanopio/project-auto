import styles from './Process.module.css';

const STEPS = [
  { num: '01', t: 0.10, title: 'Discovery & Audit', desc: 'We map your current workflow, identify where manual work is eating your team\'s time, and find every automation opportunity. No guesswork — just a clear picture of what\'s worth building first.' },
  { num: '02', t: 0.24, title: 'Scope & Fixed Quote', desc: 'You get a clear scope document and a fixed price before we write a single line of code. No hourly surprises, no scope creep billed back to you.' },
  { num: '03', t: 0.38, title: 'Build & Weekly Check-ins', desc: 'We build in your actual environment with weekly updates so you always know where things stand. You\'re never left wondering what\'s happening.' },
  { num: '04', t: 0.52, title: 'Test & Harden', desc: 'Every integration is tested against failure states, bad payloads, network timeouts, and duplicate events — the same QA discipline used in regulated enterprise systems.' },
  { num: '05', t: 0.66, title: 'Handoff & Documentation', desc: 'You receive full documentation: webhook endpoints, trigger conditions, field mappings, and operational runbooks. A system your team can understand and maintain — not a black box.' },
];

export default function Process() {
  return (
    <section id="process" className="section section-alt" data-progress>
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">Process</p>
          <h2 className="h2">How we <span className="gradient-text">actually</span> work</h2>
          <p className={`lede ${styles.sub}`}>
            A fixed-price, documented process from audit to handoff.
            No retainers, no lock-in, no black boxes.
          </p>
        </div>

        <div className={styles.trace}>
          <div className={styles.line} aria-hidden="true">
            <svg viewBox="0 0 2 100" preserveAspectRatio="none">
              <path d="M1 0V100" />
              <path className={styles.ink} d="M1 0V100" pathLength="1" />
            </svg>
          </div>
          <ol className={styles.steps}>
            {STEPS.map((step) => (
              <li key={step.num} className={styles.step} data-n={step.num} style={{ '--t': step.t }}>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.desc}>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

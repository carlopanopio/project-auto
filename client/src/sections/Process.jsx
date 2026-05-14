import styles from './Process.module.css';

const STEPS = [
  { num: '01', title: 'Discovery & Audit', desc: 'We map your current workflow, identify where manual work is eating your team\'s time, and find every automation opportunity. No guesswork — just a clear picture of what\'s worth building first.' },
  { num: '02', title: 'Scope & Fixed Quote', desc: 'You get a clear scope document and a fixed price before we write a single line of code. No hourly surprises, no scope creep billed back to you.' },
  { num: '03', title: 'Build & Weekly Check-ins', desc: 'We build in your actual environment with weekly updates so you always know where things stand. You\'re never left wondering what\'s happening.' },
  { num: '04', title: 'Test & Harden', desc: 'Every integration is tested against failure states, bad payloads, network timeouts, and duplicate events — the same QA discipline used in regulated enterprise systems.' },
  { num: '05', title: 'Handoff & Documentation', desc: 'You receive full documentation: webhook endpoints, trigger conditions, field mappings, and operational runbooks. A system your team can understand and maintain — not a black box.' },
];

export default function Process() {
  return (
    <section id="process" className={`section ${styles.process}`}>
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <h2 className={styles.heading}>
            How we<br />
            <span className="gradient-text">actually work</span>
          </h2>
          <p className={styles.sub}>
            A fixed-price, documented process from audit to handoff.
            No retainers, no lock-in, no black boxes.
          </p>
        </div>

        <div className={styles.blocks}>
          {STEPS.map((step, i) => {
            const isEven = i % 2 === 1;
            return (
              <div
                key={step.num}
                className={`${styles.block} ${isEven ? styles.blockReverse : ''} reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <div className={styles.numWrap}>
                  <span className={styles.num}>{step.num}</span>
                </div>
                <div className={`${styles.content} ${isEven ? styles.contentRight : ''}`}>
                  <h3 className={styles.title}>{step.title}</h3>
                  <p className={styles.desc}>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

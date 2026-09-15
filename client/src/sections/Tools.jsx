import styles from './Tools.module.css';

const TOOLS = [
  'GoHighLevel', 'n8n', 'Make.com', 'Zapier', 'Node.js', 'Python',
  'React', 'PayMongo', 'GCash', 'Maya', 'Stripe', 'Docker', 'Railway',
  'REST API', 'Webhooks', 'WordPress', 'Shopify', 'JIRA', 'GitHub',
];

const PRACTICES = [
  'Webhook retries', 'Idempotent handlers', 'Payload validation', 'Reconciliation',
  'Runbooks', 'Field mappings', 'Edge-case QA', 'Load testing', 'Fixed-price scope', 'Weekly check-ins',
];

function Row({ items, className }) {
  const doubled = [...items, ...items];
  return (
    <div className={`${styles.row} ${className}`}>
      {doubled.map((t, i) => (
        <span key={i} className={styles.item}>{t}</span>
      ))}
    </div>
  );
}

export default function Tools() {
  return (
    <div className={styles.wrapper} data-progress aria-hidden="true">
      <Row items={TOOLS} className={styles.rowA} />
      <Row items={PRACTICES} className={styles.rowB} />
    </div>
  );
}

import styles from './Tools.module.css';

const TOOLS = [
  'GoHighLevel', 'n8n', 'Make.com', 'Zapier', 'Node.js', 'Python',
  'React', 'PayMongo', 'GCash', 'Maya', 'Stripe', 'Docker', 'Railway',
  'REST API', 'Webhooks', 'WordPress', 'Shopify', 'JIRA', 'GitHub',
];

export default function Tools() {
  const doubled = [...TOOLS, ...TOOLS];
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.fade} />
      <div className={styles.track}>
        {doubled.map((t, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.dot} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

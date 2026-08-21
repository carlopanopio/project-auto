import { useState } from 'react';
import { submitCrmLead, N8nError } from '../../lib/n8n.js';
import AirtableEmbed from './AirtableEmbed.jsx';
import styles from './CrmSyncDemo.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { name: '', email: '', company: '' };

function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Name is required';
  if (!form.email.trim()) errs.email = 'Email is required';
  else if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Enter a valid email';
  if (!form.company.trim()) errs.company = 'Company is required';
  return errs;
}

export default function CrmSyncDemo() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | rate_limited | error
  const [message, setMessage] = useState('');
  const [duplicate, setDuplicate] = useState(false);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    setMessage('');
    try {
      const data = await submitCrmLead(form);
      setStatus('success');
      setMessage(data.message);
      setDuplicate(Boolean(data.duplicate));
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus(err instanceof N8nError && err.kind === 'rate_limited' ? 'rate_limited' : 'error');
      setMessage(err.message);
    }
  }

  const loading = status === 'loading';

  return (
    <div className={styles.inner}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-name">Name</label>
          <input
            id="lead-name"
            className={styles.input}
            type="text"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            disabled={loading}
          />
          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-email">Email</label>
          <input
            id="lead-email"
            className={styles.input}
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            disabled={loading}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-company">Company</label>
          <input
            id="lead-company"
            className={styles.input}
            type="text"
            value={form.company}
            onChange={(e) => setField('company', e.target.value)}
            disabled={loading}
          />
          {errors.company && <span className={styles.errorText}>{errors.company}</span>}
        </div>

        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit'}
        </button>

        {status === 'rate_limited' && <p className={styles.rateLimitNotice}>{message}</p>}
        {status === 'error' && <p className={styles.errorNotice}>{message}</p>}
        {status === 'success' && (
          <div>
            <p className={styles.successNotice}>{message}</p>
            {duplicate && (
              <p className={styles.duplicateNote}>Looks like we've seen this email before — that's fine, it's a demo!</p>
            )}
          </div>
        )}
      </form>

      <div className={styles.embedWrapper}>
        <AirtableEmbed />
      </div>
    </div>
  );
}

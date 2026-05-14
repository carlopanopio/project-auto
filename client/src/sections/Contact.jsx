import { useState } from 'react';
import { submitContact } from '../lib/api.js';
import styles from './Contact.module.css';

const EMPTY = { name: '', email: '', company: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await submitContact(form);
      setStatus('success');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className="container">
        <div className={styles.inner}>
          <div className={`${styles.left} reveal`}>
            <span className={styles.label}>Get in Touch</span>
            <h2 className={styles.heading}>
              Ready to stop doing things <span className="gradient-text">manually?</span>
            </h2>
            <p className={styles.sub}>
              Tell us what you're working with and where the bottlenecks are.
              We'll come back with a clear plan — no fluff, no lock-in.
            </p>
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6z"/>
                  <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
                </svg>
                hello@automationhub.ph
              </div>
              <div className={styles.infoItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Response within 24 hours
              </div>
            </div>
          </div>

          <form className={`${styles.form} reveal reveal-delay-2`} onSubmit={handleSubmit} noValidate>
            {status === 'success' ? (
              <div className={styles.success}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3>Message received!</h3>
                <p>We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Name *</label>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={set('name')}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Email *</label>
                    <input
                      className={styles.input}
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={set('email')}
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Company</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Company name (optional)"
                    value={form.company}
                    onChange={set('company')}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Tell us about your project *</label>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="What processes do you want to automate? What tools are you using?"
                    value={form.message}
                    onChange={set('message')}
                    required
                    rows={5}
                  />
                </div>

                {status === 'error' && (
                  <p className={styles.error}>{errorMsg}</p>
                )}

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Sending…' : 'Send Inquiry'}
                  {status !== 'loading' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

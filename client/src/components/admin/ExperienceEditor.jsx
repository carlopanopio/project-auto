import { useEffect, useState } from 'react';
import { adminGetExperience, adminCreateExperience, adminUpdateExperience, adminDeleteExperience } from '../../lib/api.js';
import styles from './Admin.module.css';

const EMPTY = { role: '', company: '', period: '', bullets: '', sort_order: 0 };

function fromRow(r) { return { ...r, bullets: (r.bullets || []).join('\n') }; }
function toPayload(f) {
  return { ...f, bullets: f.bullets.split('\n').map((b) => b.trim()).filter(Boolean), sort_order: Number(f.sort_order) };
}

export default function ExperienceEditor() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);

  async function load() { setRows(await adminGetExperience()); }
  useEffect(() => { load(); }, []);

  async function save() {
    const payload = toPayload(modal.data);
    if (modal.mode === 'add') await adminCreateExperience(payload);
    else await adminUpdateExperience(modal.data.id, payload);
    setModal(null);
    load();
  }

  async function del(id) {
    if (!confirm('Delete this entry?')) return;
    await adminDeleteExperience(id);
    load();
  }

  function set(field) {
    return (e) => setModal((m) => ({ ...m, data: { ...m.data, [field]: e.target.value } }));
  }

  return (
    <>
      <h2 className={styles.pageTitle}>Experience</h2>
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={() => setModal({ mode: 'add', data: { ...EMPTY } })}>+ Add Entry</button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Role</th><th>Company</th><th>Period</th><th>Order</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.role}</td>
                <td>{r.company}</td>
                <td>{r.period}</td>
                <td>{r.sort_order}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className={styles.btnEdit} onClick={() => setModal({ mode: 'edit', data: fromRow(r) })}>Edit</button>
                  <button className={styles.btnDanger} onClick={() => del(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{modal.mode === 'add' ? 'Add Experience' : 'Edit Experience'}</h3>
            <div className={styles.field}><label className={styles.label}>Role</label><input className={styles.input} value={modal.data.role} onChange={set('role')} /></div>
            <div className={styles.field}><label className={styles.label}>Company</label><input className={styles.input} value={modal.data.company} onChange={set('company')} /></div>
            <div className={styles.field}><label className={styles.label}>Period</label><input className={styles.input} value={modal.data.period} onChange={set('period')} placeholder="2022 – Present" /></div>
            <div className={styles.field}>
              <label className={styles.label}>Bullets (one per line)</label>
              <textarea className={`${styles.input} ${styles.textarea}`} value={modal.data.bullets} onChange={set('bullets')} rows={5} />
            </div>
            <div className={styles.field}><label className={styles.label}>Sort Order</label><input className={styles.input} type="number" value={modal.data.sort_order} onChange={set('sort_order')} /></div>
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setModal(null)}>Cancel</button>
              <button className={styles.btnPrimary} onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

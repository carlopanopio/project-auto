import { useEffect, useState } from 'react';
import { adminGetTestimonials, adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial } from '../../lib/api.js';
import styles from './Admin.module.css';

const EMPTY = { client_name: '', client_title: '', body: '', rating: 5, published: true };

export default function TestimonialsEditor() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);

  async function load() { setRows(await adminGetTestimonials()); }
  useEffect(() => { load(); }, []);

  async function save() {
    const data = { ...modal.data, rating: Number(modal.data.rating) };
    if (modal.mode === 'add') await adminCreateTestimonial(data);
    else await adminUpdateTestimonial(modal.data.id, data);
    setModal(null);
    load();
  }

  async function del(id) {
    if (!confirm('Delete this testimonial?')) return;
    await adminDeleteTestimonial(id);
    load();
  }

  function set(field) {
    return (e) => setModal((m) => ({ ...m, data: { ...m.data, [field]: e.target.value } }));
  }
  function setCheck(field) {
    return (e) => setModal((m) => ({ ...m, data: { ...m.data, [field]: e.target.checked } }));
  }

  return (
    <>
      <h2 className={styles.pageTitle}>Testimonials</h2>
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={() => setModal({ mode: 'add', data: { ...EMPTY } })}>+ Add Testimonial</button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Client</th><th>Title</th><th>Rating</th><th>Published</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.client_name}</td>
                <td>{r.client_title}</td>
                <td>{'★'.repeat(r.rating)}</td>
                <td><span className={r.published ? styles.badgeGreen : styles.badgeGray}>{r.published ? 'Live' : 'Hidden'}</span></td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className={styles.btnEdit} onClick={() => setModal({ mode: 'edit', data: { ...r } })}>Edit</button>
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
            <h3 className={styles.modalTitle}>{modal.mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
            <div className={styles.field}><label className={styles.label}>Client Name</label><input className={styles.input} value={modal.data.client_name} onChange={set('client_name')} /></div>
            <div className={styles.field}><label className={styles.label}>Client Title</label><input className={styles.input} value={modal.data.client_title} onChange={set('client_title')} placeholder="CEO, Company" /></div>
            <div className={styles.field}>
              <label className={styles.label}>Quote</label>
              <textarea className={`${styles.input} ${styles.textarea}`} value={modal.data.body} onChange={set('body')} rows={4} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Rating</label>
              <select className={styles.input} value={modal.data.rating} onChange={set('rating')}>
                {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </select>
            </div>
            <div className={styles.checkboxRow}><input type="checkbox" checked={modal.data.published} onChange={setCheck('published')} /><label className={styles.label}>Published</label></div>
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

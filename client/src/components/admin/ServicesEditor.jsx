import { useEffect, useState } from 'react';
import { adminGetServices, adminCreateService, adminUpdateService, adminDeleteService } from '../../lib/api.js';
import styles from './Admin.module.css';

const EMPTY = { title: '', description: '', icon: 'workflow', sort_order: 0, published: true };
const ICONS = ['workflow', 'ai', 'crm', 'data', 'api', 'consulting'];

export default function ServicesEditor() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);

  async function load() { setRows(await adminGetServices()); }
  useEffect(() => { load(); }, []);

  async function save() {
    const data = { ...modal.data, sort_order: Number(modal.data.sort_order) };
    if (modal.mode === 'add') await adminCreateService(data);
    else await adminUpdateService(modal.data.id, data);
    setModal(null);
    load();
  }

  async function del(id) {
    if (!confirm('Delete this service?')) return;
    await adminDeleteService(id);
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
      <h2 className={styles.pageTitle}>Services</h2>
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={() => setModal({ mode: 'add', data: { ...EMPTY } })}>+ Add Service</button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Title</th><th>Icon</th><th>Published</th><th>Order</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.icon}</td>
                <td><span className={r.published ? styles.badgeGreen : styles.badgeGray}>{r.published ? 'Live' : 'Hidden'}</span></td>
                <td>{r.sort_order}</td>
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
            <h3 className={styles.modalTitle}>{modal.mode === 'add' ? 'Add Service' : 'Edit Service'}</h3>
            <div className={styles.field}><label className={styles.label}>Title</label><input className={styles.input} value={modal.data.title} onChange={set('title')} /></div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea className={`${styles.input} ${styles.textarea}`} value={modal.data.description} onChange={set('description')} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Icon</label>
              <select className={styles.input} value={modal.data.icon} onChange={set('icon')}>
                {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div className={styles.field}><label className={styles.label}>Sort Order</label><input className={styles.input} type="number" value={modal.data.sort_order} onChange={set('sort_order')} /></div>
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

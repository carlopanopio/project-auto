import { useEffect, useState } from 'react';
import { adminGetProjects, adminCreateProject, adminUpdateProject, adminDeleteProject } from '../../lib/api.js';
import styles from './Admin.module.css';

const EMPTY = { title: '', slug: '', description: '', tags: '', results: '', image_url: '', sort_order: 0, published: true };

function toPayload(f) {
  return { ...f, tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean), sort_order: Number(f.sort_order) };
}
function fromRow(r) {
  return { ...r, tags: (r.tags || []).join(', ') };
}

export default function ProjectsEditor() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit', data }

  async function load() {
    setRows(await adminGetProjects());
  }

  useEffect(() => { load(); }, []);

  async function save() {
    const payload = toPayload(modal.data);
    if (modal.mode === 'add') await adminCreateProject(payload);
    else await adminUpdateProject(modal.data.id, payload);
    setModal(null);
    load();
  }

  async function del(id) {
    if (!confirm('Delete this project?')) return;
    await adminDeleteProject(id);
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
      <h2 className={styles.pageTitle}>Projects</h2>
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={() => setModal({ mode: 'add', data: { ...EMPTY } })}>
          + Add Project
        </button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Title</th><th>Tags</th><th>Published</th><th>Order</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{(r.tags || []).join(', ')}</td>
                <td><span className={r.published ? styles.badgeGreen : styles.badgeGray}>{r.published ? 'Live' : 'Hidden'}</span></td>
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
            <h3 className={styles.modalTitle}>{modal.mode === 'add' ? 'Add Project' : 'Edit Project'}</h3>
            <div className={styles.field}><label className={styles.label}>Title</label><input className={styles.input} value={modal.data.title} onChange={set('title')} /></div>
            <div className={styles.field}><label className={styles.label}>Slug</label><input className={styles.input} value={modal.data.slug} onChange={set('slug')} /></div>
            <div className={styles.field}><label className={styles.label}>Description</label><textarea className={`${styles.input} ${styles.textarea}`} value={modal.data.description} onChange={set('description')} /></div>
            <div className={styles.field}><label className={styles.label}>Tags (comma-separated)</label><input className={styles.input} value={modal.data.tags} onChange={set('tags')} placeholder="n8n, Make, Python" /></div>
            <div className={styles.field}><label className={styles.label}>Results</label><input className={styles.input} value={modal.data.results} onChange={set('results')} /></div>
            <div className={styles.field}><label className={styles.label}>Image URL</label><input className={styles.input} value={modal.data.image_url || ''} onChange={set('image_url')} /></div>
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

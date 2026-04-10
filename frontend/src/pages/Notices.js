import React, { useEffect, useState } from 'react';
import { getNotices, createNotice, deleteNotice } from '../services/api';

const CAT_BADGE = { General:'badge-info', Exam:'badge-danger', Event:'badge-success', Holiday:'badge-warning', Fee:'badge-warning', Sports:'badge-purple' };
const EMPTY = { title: '', content: '', category: 'General', audience: 'All', priority: 'Medium' };

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [filter,  setFilter]  = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await getNotices(); setNotices(r.data.notices || []); }
    catch { setNotices([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handlePost = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await createNotice(form);
      setForm(EMPTY); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this notice?')) return;
    await deleteNotice(id); load();
  };

  const filtered = filter ? notices.filter((n) => n.category === filter) : notices;

  return (
    <>
      <style>{`
        /* Notices responsive */
        .notice-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .notice-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        @media (max-width: 540px) {
          .notice-meta-grid {
            grid-template-columns: 1fr;
          }
          .notice-meta-grid > div {
            margin-bottom: 0 !important;
          }
          .notice-filter-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        /* notice header badges: wrap on small screens */
        .notice-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }
        .notice-header-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
      `}</style>

      {/* Post form */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Post new notice</span>
          {saved && <span className="badge badge-success">Posted!</span>}
        </div>
        <form onSubmit={handlePost}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" required placeholder="Notice title…" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea className="form-textarea" rows={3} required placeholder="Notice content…" value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="notice-meta-grid">
            {[
              ['category', 'Category', ['General','Exam','Event','Holiday','Fee','Sports']],
              ['audience', 'Audience', ['All','Students','Teachers','Parents','Staff']],
              ['priority', 'Priority', ['Low','Medium','High']],
            ].map(([k, lbl, opts]) => (
              <div key={k} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{lbl}</label>
                <select className="form-select" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Posting…' : 'Post notice'}
            </button>
          </div>
        </form>
      </div>

      {/* Notice list */}
      <div className="card">
        <div className="card-header notice-filter-bar">
          <span className="card-title">All notices — {filtered.length} total</span>
          <select
            className="form-select"
            style={{ padding: '5px 9px', fontSize: 12 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All categories</option>
            {['General','Exam','Event','Holiday','Fee','Sports'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">No notices yet</div>
            <p>Post the first notice above.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div key={n._id} className="notice-item">
              <div className="notice-header">
                <span className="notice-title">{n.title}</span>
                <div className="notice-header-badges">
                  <span className={`badge ${CAT_BADGE[n.category] || 'badge-info'}`}>{n.category}</span>
                  <span className="badge badge-info" style={{ fontSize: 10 }}>{n.audience}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger-text)', padding: '2px 8px' }}
                    onClick={() => handleDelete(n._id)}
                  >×</button>
                </div>
              </div>
              <div className="notice-meta">
                {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {n.postedBy?.name ? ` · by ${n.postedBy.name}` : ''}
                {' · '}
                <span style={{ color: n.priority === 'High' ? 'var(--danger-text)' : n.priority === 'Medium' ? 'var(--warning-text)' : 'var(--success-text)' }}>
                  {n.priority} priority
                </span>
              </div>
              <div className="notice-body">{n.content}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
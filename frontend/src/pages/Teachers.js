import React, { useEffect, useState } from 'react';
import { getTeachers, createTeacher, deleteTeacher } from '../services/api';

const AV = ['av-teal','av-blue','av-amber','av-pink','av-green','av-purple'];
const av  = (n) => AV[(n?.charCodeAt(0)||0) % AV.length];
const ini = (n) => n?.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()||'??';

const EMPTY = { name:'', email:'', phone:'', subject:'', qualification:'', experience:0 };

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await getTeachers(); setTeachers(r.data.teachers || []); }
    catch { setTeachers([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await createTeacher(form); setModal(false); load(); }
    catch (err) { alert(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <style>{`
        /* Teachers responsive grid */
        .tch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 900px) {
          .tch-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .tch-grid { grid-template-columns: 1fr; }
          .tch-form-grid { grid-template-columns: 1fr !important; }
        }
        .tch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 8px;
        }
      `}</style>

      <div className="tch-header">
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {teachers.length} staff members
        </span>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal(true); }}>
          + Add teacher
        </button>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="tch-grid">
          {teachers.map((t) => (
            <div key={t._id} className="teacher-card">
              <div className="teacher-av-wrap">
                <div className={`avatar ${av(t.name)}`} style={{ width: 52, height: 52, fontSize: 17 }}>{ini(t.name)}</div>
                <div className="teacher-status-dot" style={{ background: t.isActive && !t.onLeave ? '#1D9E75' : '#E24B4A' }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.subject}</div>
              <span className={`badge ${t.isActive && !t.onLeave ? 'badge-success' : 'badge-warning'}`}>
                {t.onLeave ? 'On Leave' : t.isActive ? 'Active' : 'Inactive'}
              </span>
              <div style={{ width: '100%', borderTop: '0.5px solid var(--border)', paddingTop: 10, marginTop: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)' }}>
                  <span>{t.teacherId}</span>
                  <span>{t.experience} yrs exp</span>
                </div>
                {t.classes?.length > 0 && (
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3, textAlign: 'left' }}>
                    {t.classes.join(', ')}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'center' }}>
                  <button className="btn btn-ghost btn-sm">Edit</button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger-text)' }}
                    onClick={() => { if (window.confirm('Remove?')) deleteTeacher(t._id).then(load); }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ width: '100%', maxWidth: 500 }}>
            <div className="modal-header">
              <span className="modal-title">Add teacher</span>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="tch-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['name','Full name',true],
                  ['email','Email',true],
                  ['phone','Phone',false],
                  ['subject','Subject',true],
                  ['qualification','Qualification',false],
                  ['experience','Experience (years)',false],
                ].map(([k, lbl, req]) => (
                  <div key={k} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{lbl}</label>
                    <input
                      className="form-input"
                      required={req}
                      type={k === 'experience' ? 'number' : 'text'}
                      value={form[k]}
                      onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Add teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
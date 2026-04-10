import React, { useEffect, useState, useCallback } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/api';

const AV_COLORS = ['av-blue','av-teal','av-amber','av-pink','av-green','av-purple','av-coral'];
const avColor = (name) => AV_COLORS[(name?.charCodeAt(0) || 0) % AV_COLORS.length];
const initials = (name) => name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '??';

const EMPTY_FORM = {
  name: '', dateOfBirth: '', gender: 'Male', class: '', section: 'A',
  rollNumber: '', 'parent.name': '', 'parent.phone': '', 'parent.email': '',
  'address.city': '', 'address.state': '',
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [modal, setModal]       = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterClass) params.class = filterClass;
      const res = await getStudents(params);
      setStudents(res.data.students || []);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterClass]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditTarget(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (s) => {
    setEditTarget(s._id);
    setForm({
      name: s.name || '', dateOfBirth: s.dateOfBirth?.slice(0, 10) || '',
      gender: s.gender || 'Male', class: s.class || '', section: s.section || 'A',
      rollNumber: s.rollNumber || '',
      'parent.name': s.parent?.name || '', 'parent.phone': s.parent?.phone || '',
      'parent.email': s.parent?.email || '', 'address.city': s.address?.city || '',
      'address.state': s.address?.state || '',
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name, dateOfBirth: form.dateOfBirth, gender: form.gender,
        class: form.class, section: form.section, rollNumber: form.rollNumber,
        parent: { name: form['parent.name'], phone: form['parent.phone'], email: form['parent.email'] },
        address: { city: form['address.city'], state: form['address.state'] },
      };
      if (editTarget) await updateStudent(editTarget, payload);
      else await createStudent(payload);
      setModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this student?')) return;
    await deleteStudent(id);
    load();
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title">All students — {students.length} shown</span>
          <button className="btn btn-primary" onClick={openAdd}>+ Add student</button>
        </div>
        <div className="search-bar">
          <input className="form-input" placeholder="Search by name, ID or parent…" value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <select className="form-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">All classes</option>
            {['6','7','8','9','10','11','12'].map((c) => <option key={c}>Class {c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">No students found</div>
            <p>Try a different search or add a new student.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Student</th><th>ID</th><th>Class</th><th>Parent</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="name-cell">
                        <div className={`avatar ${avColor(s.name)}`}>{initials(s.name)}</div>
                        {s.name}
                      </div>
                    </td>
                    <td className="text-muted" style={{ fontSize: 12 }}>{s.studentId}</td>
                    <td>Class {s.class}-{s.section}</td>
                    <td className="text-muted">{s.parent?.name || '—'}</td>
                    <td><span className={`badge ${s.isActive ? 'badge-success' : 'badge-danger'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger-text)' }} onClick={() => handleDelete(s._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editTarget ? 'Edit student' : 'Add new student'}</span>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['name','Full name','text',true],['dateOfBirth','Date of birth','date'],['class','Class','text',true],['section','Section','text']].map(([k,lbl,type,req]) => (
                  <div key={k} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{lbl}</label>
                    <input className="form-input" type={type||'text'} required={req}
                      value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  </div>
                ))}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Roll number</label>
                  <input className="form-input" type="number" value={form.rollNumber}
                    onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
                </div>
              </div>
              <div style={{ borderTop: '0.5px solid var(--border)', margin: '14px 0', paddingTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>PARENT DETAILS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[['parent.name','Parent name'],['parent.phone','Phone'],['parent.email','Email']].map(([k,lbl]) => (
                    <div key={k} className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">{lbl}</label>
                      <input className="form-input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                    </div>
                  ))}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">City</label>
                    <input className="form-input" value={form['address.city']} onChange={(e) => setForm({ ...form, 'address.city': e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editTarget ? 'Update' : 'Add student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { getStudents, getAttendance, markBulkAttendance } from '../services/api';

const AV = ['av-blue','av-teal','av-amber','av-pink','av-green','av-purple'];
const av  = (n) => AV[(n?.charCodeAt(0)||0) % AV.length];
const ini = (n) => n?.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()||'??';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const MOCK_CAL = ['n','n','P','P','P','H','n','P','P','P','P','H','A','n','P','A','P','P','P','A','n','P','P','P','P','P','A','n','P','P','P'];

export default function Attendance() {
  const [students,   setStudents]  = useState([]);
  const [attendance, setAttendance] = useState({});
  const [cls,   setCls]   = useState('10');
  const [sec,   setSec]   = useState('A');
  const [today] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    getStudents({ class: cls, section: sec })
      .then((r) => {
        const list = r.data.students || [];
        setStudents(list);
        const init = {};
        list.forEach((s) => (init[s._id] = 'Present'));
        setAttendance(init);
      })
      .catch(() => setStudents([]));
  }, [cls, sec]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map((s) => ({ studentId: s._id, status: attendance[s._id] || 'Present' }));
      await markBulkAttendance({ records, class: cls, section: sec, date: today });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter((v) => v === 'Present').length;
  const absentCount  = Object.values(attendance).filter((v) => v === 'Absent').length;
  const pct = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <>
      <style>{`
        .att-outer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .att-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 14px;
        }
        /* on mobile, stack the two cards vertically */
        @media (max-width: 700px) {
          .att-outer-grid {
            grid-template-columns: 1fr;
          }
        }
        /* make attendance table rows touch-friendly */
        @media (max-width: 480px) {
          .att-stats-row {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }
          .att-table-select {
            min-width: 90px;
          }
          .att-header-selects {
            flex-wrap: wrap;
            gap: 6px !important;
          }
          .att-calendar {
            gap: 3px !important;
          }
          .att-cell {
            width: 28px !important;
            height: 28px !important;
            font-size: 9px !important;
          }
          .att-day-label {
            font-size: 9px !important;
          }
        }
      `}</style>

      <div className="att-outer-grid">
        {/* Calendar */}
        <div className="card mb-0">
          <div className="card-header">
            <span className="card-title">April 2026 — Monthly view</span>
            <div className="att-header-selects" style={{ display: 'flex', gap: 8 }}>
              <select className="form-select" style={{ padding: '4px 8px', fontSize: 12 }} value={cls} onChange={(e) => setCls(e.target.value)}>
                {['6','7','8','9','10','11','12'].map((c) => <option key={c}>Class {c}</option>)}
              </select>
              <select className="form-select" style={{ padding: '4px 8px', fontSize: 12 }} value={sec} onChange={(e) => setSec(e.target.value)}>
                {['A','B','C','D'].map((s) => <option key={s}>Section {s}</option>)}
              </select>
            </div>
          </div>

          <div className="att-calendar">
            {DAYS.map((d) => <div key={d} className="att-day-label">{d}</div>)}
            {MOCK_CAL.map((s, i) => (
              <div key={i} className={`att-cell ${s==='P'?'att-present':s==='A'?'att-absent':s==='H'?'att-holiday':'att-nil'}`}>
                {s === 'n' ? '' : s}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, marginTop: 13, fontSize: 11, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            {[['att-present','Present'],['att-absent','Absent'],['att-holiday','Holiday']].map(([cls, lbl]) => (
              <span key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className={`att-cell ${cls}`} style={{ width: 10, height: 10, borderRadius: 3, flexShrink: 0 }} />
                {lbl}
              </span>
            ))}
          </div>

          <div className="att-stats-row">
            {[['22','Present','var(--success-text)'],['3','Absent','var(--danger-text)'],['2','Holidays','var(--warning-text)']].map(([v, l, c]) => (
              <div key={l} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mark attendance */}
        <div className="card mb-0">
          <div className="card-header">
            <span className="card-title">Mark attendance — {today}</span>
            {saved && <span className="badge badge-success">Saved!</span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Class {cls}{sec} · {students.length} students · {pct}% present today
          </div>
          <div className="progress-wrap" style={{ marginBottom: 14 }}>
            <div className="progress-fill" style={{ width: pct + '%', background: pct > 85 ? '#1D9E75' : pct > 70 ? '#EF9F27' : '#E24B4A' }} />
          </div>

          {students.length === 0 ? (
            <div className="empty-state" style={{ padding: 24 }}>
              <div className="empty-title">No students in this class</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Status</th></tr></thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div className="name-cell">
                          <div className={`avatar ${av(s.name)}`} style={{ width: 26, height: 26, fontSize: 10 }}>{ini(s.name)}</div>
                          {s.name}
                        </div>
                      </td>
                      <td>
                        <select
                          className="form-select att-table-select"
                          style={{ padding: '4px 8px', fontSize: 12 }}
                          value={attendance[s._id] || 'Present'}
                          onChange={(e) => setAttendance({ ...attendance, [s._id]: e.target.value })}
                        >
                          <option>Present</option>
                          <option>Absent</option>
                          <option>Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <button
              className="btn btn-ghost"
              style={{ flex: 1, minWidth: 120 }}
              onClick={() => { const all = {}; students.forEach((s) => (all[s._id] = 'Present')); setAttendance(all); }}
            >
              Mark all present
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1, minWidth: 120 }}
              onClick={handleSave}
              disabled={saving || students.length === 0}
            >
              {saving ? 'Saving…' : 'Save attendance'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
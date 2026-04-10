import React, { useEffect, useState } from 'react';
import { getResults } from '../services/api';

const MOCK_RESULT = {
  student: { name: 'Arjun Kumar', studentId: 'S2024001', class: '10', section: 'A' },
  term: 'Term 1', academicYear: '2025-26', rank: 3, percentage: 88, grade: 'A',
  subjects: [
    { subject: 'Tamil',          marksObtained: 92, maxMarks: 100, grade: 'A+' },
    { subject: 'English',        marksObtained: 87, maxMarks: 100, grade: 'A'  },
    { subject: 'Mathematics',    marksObtained: 95, maxMarks: 100, grade: 'A+' },
    { subject: 'Science',        marksObtained: 84, maxMarks: 100, grade: 'B+' },
    { subject: 'Social Science', marksObtained: 80, maxMarks: 100, grade: 'B+' },
    { subject: 'Computer',       marksObtained: 92, maxMarks: 100, grade: 'A+' },
  ],
};

const gradeColor = (g) => {
  if (!g) return ['#EAF3DE','#27500A','#1D9E75'];
  if (g.includes('+')) return ['#EAF3DE','#27500A','#1D9E75'];
  if (g === 'A') return ['#E6F1FB','#0C447C','#378ADD'];
  if (g.startsWith('B')) return ['#FAEEDA','#633806','#EF9F27'];
  return ['#FCEBEB','#791F1F','#E24B4A'];
};

export default function Results() {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(MOCK_RESULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResults()
      .then((r) => setResults(r.data.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const total = selected.subjects.reduce((a, s) => a + s.marksObtained, 0);
  const maxTotal = selected.subjects.reduce((a, s) => a + s.maxMarks, 0);
  const pct = Math.round((total / maxTotal) * 100);

  return (
    <div className="card">
      {/* Student header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="avatar av-blue" style={{ width: 52, height: 52, fontSize: 18 }}>
            {selected.student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{selected.student.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {selected.student.studentId} · Class {selected.student.class}{selected.student.section} · {selected.term} · {selected.academicYear}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{pct}%</div>
          <div style={{ marginTop: 6 }}>
            <span className="badge badge-success" style={{ fontSize: 12 }}>
              Grade {selected.grade} · Rank {selected.rank}
            </span>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="progress-wrap" style={{ height: 8, marginBottom: 20 }}>
        <div className="progress-fill" style={{ width: pct + '%', background: '#1D9E75' }} />
      </div>

      {/* Subject rows */}
      {selected.subjects.map((s) => {
        const [gbg, gtc, gc] = gradeColor(s.grade);
        const subPct = Math.round((s.marksObtained / s.maxMarks) * 100);
        return (
          <div key={s.subject} className="result-row">
            <div className="result-subject">{s.subject}</div>
            <div style={{ flex: 1 }}>
              <div className="progress-wrap">
                <div className="progress-fill" style={{ width: subPct + '%', background: gc }} />
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 52, textAlign: 'right' }}>
              {s.marksObtained}/{s.maxMarks}
            </div>
            <div className="grade-circle" style={{ background: gbg, color: gtc }}>{s.grade}</div>
          </div>
        );
      })}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 18 }}>
        {[['Total marks', `${total}/${maxTotal}`], ['Percentage', `${pct}%`], ['Grade', selected.grade], ['Rank', `${selected.rank} of 42`]].map(([l, v]) => (
          <div key={l} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{v}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const TT_COLORS = {
  Mathematics: ['#E6F1FB','#185FA5'],
  Tamil:       ['#FAEEDA','#854F0B'],
  English:     ['#E1F5EE','#0F6E56'],
  Physics:     ['#EAF3DE','#3B6D11'],
  Chemistry:   ['#FCEBEB','#A32D2D'],
  Biology:     ['#EEEDFE','#534AB7'],
  Social:      ['#FAECE7','#993C1D'],
  Computer:    ['#FBEAF0','#993556'],
};

const SLOTS = [
  ['8:00–9:00',   [['Mathematics','Sivakumar R'],['English','Vijaya R'],   ['Tamil','Latha K'],     ['Physics','Prasad M'],  ['Mathematics','Sivakumar R']]],
  ['9:00–10:00',  [['English','Vijaya R'],   ['Tamil','Latha K'],      ['Mathematics','Sivakumar R'],['English','Vijaya R'],  ['Social','Kumar S']]],
  ['10:15–11:15', [['Physics','Prasad M'],   ['Mathematics','Sivakumar R'],['Chemistry','Anbu B'],  ['Tamil','Latha K'],     ['Computer','Balu K']]],
  ['11:15–12:15', [['Social','Kumar S'],     ['Computer','Balu K'],    ['English','Vijaya R'],  ['Mathematics','Sivakumar R'],['Biology','Kavitha M']]],
  ['1:15–2:15',   [['Tamil','Latha K'],      ['Chemistry','Anbu B'],   ['Social','Kumar S'],    ['Computer','Balu K'],   ['Physics','Prasad M']]],
];

export default function Timetable() {
  const [cls, setCls] = useState('10');
  const [sec, setSec] = useState('A');

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Weekly timetable — Class {cls}{sec}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="form-select" style={{ padding: '5px 9px', fontSize: 12 }} value={cls} onChange={(e) => setCls(e.target.value)}>
            {['6','7','8','9','10','11','12'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="form-select" style={{ padding: '5px 9px', fontSize: 12 }} value={sec} onChange={(e) => setSec(e.target.value)}>
            {['A','B','C','D'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="tt-grid">
        <div />
        {['Monday','Tuesday','Wednesday','Thursday','Friday'].map((d) => (
          <div key={d} className="tt-head">{d}</div>
        ))}

        {SLOTS.map(([time, row]) => (
          <React.Fragment key={time}>
            <div className="tt-time" style={{ fontSize: 10, paddingRight: 6 }}>{time}</div>
            {row.map(([sub, tch], i) => {
              const [bg, tc] = TT_COLORS[sub] || ['#F1EFE8','#5F5E5A'];
              return (
                <div key={i} className="tt-cell" style={{ background: bg }}>
                  <div className="tt-subject" style={{ color: tc }}>{sub}</div>
                  <div className="tt-teacher" style={{ color: tc }}>{tch}</div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        {Object.entries(TT_COLORS).map(([sub, [bg, tc]]) => (
          <span key={sub} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: tc, background: bg, padding: '3px 9px', borderRadius: 20 }}>
            {sub}
          </span>
        ))}
      </div>
    </div>
  );
}

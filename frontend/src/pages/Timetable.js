import React, { useState } from 'react';

const TT_COLORS = {
  Mathematics: ['#E6F1FB', '#185FA5'],
  Tamil:       ['#FAEEDA', '#854F0B'],
  English:     ['#E1F5EE', '#0F6E56'],
  Physics:     ['#EAF3DE', '#3B6D11'],
  Chemistry:   ['#FCEBEB', '#A32D2D'],
  Biology:     ['#EEEDFE', '#534AB7'],
  Social:      ['#FAECE7', '#993C1D'],
  Computer:    ['#FBEAF0', '#993556'],
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

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
  const [activeDay, setActiveDay] = useState(0); // for mobile day tab

  return (
    <>
      <style>{`
        /* ── Timetable Desktop Grid ── */
        .tt-grid {
          display: grid;
          grid-template-columns: 72px repeat(5, 1fr);
          gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .tt-head {
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          padding: 6px 4px;
          text-transform: uppercase;
          letter-spacing: .05em;
        }
        .tt-time {
          font-size: 10px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 6px;
          line-height: 1.3;
          text-align: right;
        }
        .tt-cell {
          border-radius: 8px;
          padding: 8px 10px;
          min-height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 3px;
        }
        .tt-subject {
          font-size: 12px;
          font-weight: 700;
          line-height: 1.2;
        }
        .tt-teacher {
          font-size: 10px;
          opacity: .72;
          line-height: 1.2;
        }

        /* ── Mobile: Day Tabs + Single Column ── */
        .tt-mobile-tabs {
          display: none;
        }
        .tt-mobile-day {
          display: none;
        }
        .tt-day-tab {
          flex: 1;
          padding: 7px 4px;
          font-size: 11px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background .15s, color .15s;
          font-family: inherit;
        }
        .tt-day-tab.active {
          background: var(--primary);
          color: #fff;
        }
        .tt-mobile-slot {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 0.5px solid var(--border);
        }
        .tt-mobile-slot:last-child {
          border-bottom: none;
        }
        .tt-mobile-time {
          font-size: 10px;
          color: var(--text-secondary);
          min-width: 62px;
          text-align: right;
          flex-shrink: 0;
          line-height: 1.3;
        }
        .tt-mobile-cell {
          flex: 1;
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        @media (max-width: 640px) {
          .tt-grid {
            display: none !important;
          }
          .tt-mobile-tabs {
            display: flex !important;
            gap: 4px;
            margin-bottom: 14px;
            background: var(--bg-secondary);
            border-radius: 10px;
            padding: 4px;
          }
          .tt-mobile-day {
            display: block !important;
          }
          .tt-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 14px;
          }
        }

        /* break-points for tablet: show short day names */
        @media (min-width: 641px) and (max-width: 900px) {
          .tt-head-full { display: none; }
          .tt-head-short { display: block; }
          .tt-grid {
            grid-template-columns: 60px repeat(5, 1fr);
            gap: 4px;
          }
          .tt-cell {
            padding: 6px 7px;
            min-height: 54px;
          }
          .tt-subject { font-size: 11px; }
          .tt-teacher { font-size: 9px; }
        }
        @media (min-width: 901px) {
          .tt-head-full { display: block; }
          .tt-head-short { display: none; }
        }
      `}</style>

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

        {/* ── Mobile Day Tabs ── */}
        <div className="tt-mobile-tabs">
          {DAYS_SHORT.map((d, i) => (
            <button
              key={d}
              className={`tt-day-tab ${activeDay === i ? 'active' : ''}`}
              onClick={() => setActiveDay(i)}
            >
              {d}
            </button>
          ))}
        </div>

        {/* ── Mobile Single-Day View ── */}
        <div className="tt-mobile-day">
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
            {DAYS[activeDay]}
          </div>
          {SLOTS.map(([time, row]) => {
            const [sub, tch] = row[activeDay];
            const [bg, tc] = TT_COLORS[sub] || ['#F1EFE8', '#5F5E5A'];
            return (
              <div key={time} className="tt-mobile-slot">
                <div className="tt-mobile-time">{time}</div>
                <div className="tt-mobile-cell" style={{ background: bg }}>
                  <div className="tt-subject" style={{ color: tc }}>{sub}</div>
                  <div className="tt-teacher" style={{ color: tc }}>{tch}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Desktop / Tablet Full Grid ── */}
        <div className="tt-grid">
          {/* Header row */}
          <div />
          {DAYS.map((d, i) => (
            <div key={d} className="tt-head">
              <span className="tt-head-full">{d}</span>
              <span className="tt-head-short">{DAYS_SHORT[i]}</span>
            </div>
          ))}

          {SLOTS.map(([time, row]) => (
            <React.Fragment key={time}>
              <div className="tt-time">{time}</div>
              {row.map(([sub, tch], i) => {
                const [bg, tc] = TT_COLORS[sub] || ['#F1EFE8', '#5F5E5A'];
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

        {/* ── Legend ── */}
        <div className="tt-legend" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {Object.entries(TT_COLORS).map(([sub, [bg, tc]]) => (
            <span
              key={sub}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, color: tc, background: bg,
                padding: '3px 9px', borderRadius: 20,
              }}
            >
              {sub}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
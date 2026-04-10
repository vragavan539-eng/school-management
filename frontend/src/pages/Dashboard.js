import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler } from 'chart.js';
import { getStudents, getTeachers, getNotices } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler);

const STATS = [
  { label: 'Total Students', value: '1,248', trend: '+24 this month', color: '#1D9E75', sparks: [3,5,4,6,5,7,8] },
  { label: 'Teachers',       value: '64',    trend: '+2 joining',     color: '#378ADD', sparks: [6,6,7,6,6,5,6] },
  { label: "Today's Attendance", value: '91%', trend: '-3% vs avg',   color: '#EF9F27', sparks: [85,92,88,90,87,91,91] },
  { label: 'Pending Fees',   value: '₹2.4L', trend: '18 students',    color: '#D4537E', sparks: [5,4,6,5,4,3,5] },
];

const RECENT = [
  { init: 'AK', av: 'av-blue',   name: 'Arjun Kumar',   cls: '10-A', badge: 'badge-info',    event: 'Marked present',   time: '8:45 AM' },
  { init: 'PS', av: 'av-pink',   name: 'Priya Sharma',  cls: '9-B',  badge: 'badge-success', event: 'Result updated',   time: '9:10 AM' },
  { init: 'RV', av: 'av-amber',  name: 'Ravi Venkat',   cls: '11-C', badge: 'badge-warning', event: 'Fee pending',      time: '9:30 AM' },
  { init: 'MN', av: 'av-teal',   name: 'Meena Nair',    cls: '8-A',  badge: 'badge-info',    event: 'Marked present',   time: '9:45 AM' },
  { init: 'SK', av: 'av-green',  name: 'Suresh Karan',  cls: '12-B', badge: 'badge-danger',  event: 'Absent today',     time: '10:00 AM' },
];

const CLASS_PERF = [
  { cls: '12th', pct: 94, color: '#1D9E75' }, { cls: '11th', pct: 88, color: '#1D9E75' },
  { cls: '10th', pct: 91, color: '#1D9E75' }, { cls: '9th',  pct: 85, color: '#378ADD' },
  { cls: '8th',  pct: 78, color: '#EF9F27' }, { cls: '7th',  pct: 82, color: '#378ADD' },
  { cls: '6th',  pct: 89, color: '#1D9E75' },
];

export default function Dashboard() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    getNotices().then((r) => setNotices(r.data.notices?.slice(0, 3) || [])).catch(() => {});
  }, []);

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Attendance %',
      data: [88, 92, 89, 95, 91, 87],
      borderColor: '#1D9E75',
      backgroundColor: 'rgba(29,158,117,0.08)',
      tension: 0.4, fill: true, pointRadius: 4,
      pointBackgroundColor: '#1D9E75',
    }],
  };
  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index' } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { min: 75, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 }, callback: (v) => v + '%' } },
    },
  };

  const donutData = {
    labels: ['Paid', 'Partial', 'Pending'],
    datasets: [{ data: [78, 12, 10], backgroundColor: ['#1D9E75', '#EF9F27', '#E24B4A'], borderWidth: 0 }],
  };
  const donutOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } } }, cutout: '70%' };

  return (
    <>
      {/* Stats */}
      <div className="stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-bar" style={{ background: s.color }} />
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-trend">
              <span className="badge badge-success" style={{ fontSize: 10 }}>{s.trend}</span>
            </div>
            <div className="stat-sparkline">
              {s.sparks.map((h, i) => (
                <div key={i} className="spark-bar"
                  style={{ height: Math.round(h / 8 * 100) + '%', background: s.color, opacity: i === s.sparks.length - 1 ? 1 : 0.25 + i * 0.1 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2">
        <div className="card mb-0">
          <div className="card-header">
            <span className="card-title">Weekly attendance trend</span>
            <span className="badge badge-success">This week</span>
          </div>
          <div style={{ height: 160 }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="card mb-0">
          <div className="card-header">
            <span className="card-title">Fee collection status</span>
          </div>
          <div style={{ height: 160 }}>
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid-2" style={{ marginTop: 12 }}>
        <div className="card mb-0">
          <div className="card-header">
            <span className="card-title">Recent activity</span>
            <span className="card-action">View all</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Class</th><th>Event</th><th>Time</th></tr></thead>
              <tbody>
                {RECENT.map((r) => (
                  <tr key={r.name}>
                    <td><div className="name-cell"><div className={`avatar ${r.av}`}>{r.init}</div>{r.name}</div></td>
                    <td className="text-muted">{r.cls}</td>
                    <td><span className={`badge ${r.badge}`}>{r.event}</span></td>
                    <td className="text-muted">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card mb-0">
            <div className="card-header">
              <span className="card-title">Class performance</span>
            </div>
            {CLASS_PERF.map((c) => (
              <div key={c.cls} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 34 }}>{c.cls}</span>
                <div className="progress-wrap" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: c.pct + '%', background: c.color }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, minWidth: 36, textAlign: 'right' }}>{c.pct}%</span>
              </div>
            ))}
          </div>

          <div className="card mb-0">
            <div className="card-header">
              <span className="card-title">Recent notices</span>
            </div>
            {notices.length > 0 ? notices.map((n) => (
              <div key={n._id} className="notice-item" style={{ paddingTop: 8 }}>
                <div className="notice-meta">{new Date(n.createdAt).toLocaleDateString('en-IN')}</div>
                <div className="notice-title" style={{ fontSize: 12, marginBottom: 2 }}>{n.title}</div>
              </div>
            )) : (
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>No notices yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

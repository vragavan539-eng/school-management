import React, { useEffect, useState } from 'react';
import { getFees, recordPayment } from '../services/api';

const MOCK_FEES = [
  { _id:'1', student:{name:'Arjun Kumar',  studentId:'S2024001',class:'10',section:'A'}, totalAmount:24000, paidAmount:24000, dueDate:'2026-04-15', status:'Paid'    },
  { _id:'2', student:{name:'Priya Sharma', studentId:'S2024002',class:'9', section:'B'}, totalAmount:22000, paidAmount:22000, dueDate:'2026-04-15', status:'Paid'    },
  { _id:'3', student:{name:'Ravi Venkat',  studentId:'S2024004',class:'11',section:'C'}, totalAmount:26000, paidAmount:13000, dueDate:'2026-04-15', status:'Partial' },
  { _id:'4', student:{name:'Suresh Karan', studentId:'S2024005',class:'12',section:'B'}, totalAmount:28000, paidAmount:0,     dueDate:'2026-04-15', status:'Pending' },
  { _id:'5', student:{name:'Meena Nair',   studentId:'S2024003',class:'8', section:'A'}, totalAmount:20000, paidAmount:20000, dueDate:'2026-04-15', status:'Paid'    },
  { _id:'6', student:{name:'Divya Pillai', studentId:'S2024006',class:'7', section:'A'}, totalAmount:18000, paidAmount:9000,  dueDate:'2026-04-15', status:'Partial' },
];

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function Fees() {
  const [fees, setFees]         = useState(MOCK_FEES);
  const [filter, setFilter]     = useState('');
  const [search, setSearch]     = useState('');
  const [payModal, setPayModal] = useState(null);
  const [payForm,  setPayForm]  = useState({ amount: '', method: 'Cash', receiptNo: '' });
  const [saving, setSaving]     = useState(false);

  const totalCollected = fees.reduce((a, f) => a + f.paidAmount, 0);
  const totalPending   = fees.reduce((a, f) => a + (f.totalAmount - f.paidAmount), 0);
  const paidCount      = fees.filter((f) => f.status === 'Paid').length;

  const filtered = fees.filter((f) => {
    const matchFilter = !filter || f.status === filter;
    const matchSearch = !search || f.student.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handlePayment = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      // In production: await recordPayment(payModal._id, payForm);
      setFees(fees.map((f) => f._id === payModal._id
        ? { ...f, paidAmount: f.paidAmount + Number(payForm.amount), status: f.paidAmount + Number(payForm.amount) >= f.totalAmount ? 'Paid' : 'Partial' }
        : f
      ));
      setPayModal(null);
    } finally { setSaving(false); }
  };

  return (
    <>
      <div className="stats-grid cols3">
        {[
          ['Total collected', fmt(totalCollected), 'badge-success', `${paidCount} students fully paid`],
          ['Pending',         fmt(totalPending),   'badge-danger',  `${fees.length - paidCount} students`],
          ['Collection rate', Math.round((totalCollected/(totalCollected+totalPending))*100) + '%', 'badge-info', 'This term'],
        ].map(([lbl, val, bc, sub]) => (
          <div key={lbl} className="stat-card">
            <div className="stat-label">{lbl}</div>
            <div className="stat-value">{val}</div>
            <div className="stat-trend"><span className={`badge ${bc}`} style={{ fontSize: 10 }}>{sub}</span></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Fee records</span>
          <button className="btn btn-primary btn-sm">+ Add fee record</button>
        </div>
        <div className="search-bar">
          <input className="form-input" placeholder="Search student…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All status</option>
            <option>Paid</option><option>Partial</option><option>Pending</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Student</th><th>Class</th><th>Total</th><th>Paid</th><th>Balance</th><th>Due Date</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const balance = f.totalAmount - f.paidAmount;
                return (
                  <tr key={f._id}>
                    <td>
                      <div className="name-cell">
                        <div className="avatar av-blue" style={{ width: 26, height: 26, fontSize: 10 }}>
                          {f.student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        {f.student.name}
                      </div>
                    </td>
                    <td className="text-muted">{f.student.class}{f.student.section}</td>
                    <td>{fmt(f.totalAmount)}</td>
                    <td className="text-success fw-500">{fmt(f.paidAmount)}</td>
                    <td style={{ color: balance > 0 ? 'var(--danger-text)' : 'var(--text-secondary)', fontWeight: balance > 0 ? 600 : 400 }}>
                      {fmt(balance)}
                    </td>
                    <td className="text-muted">{new Date(f.dueDate).toLocaleDateString('en-IN')}</td>
                    <td><span className={`badge ${f.status==='Paid'?'badge-success':f.status==='Partial'?'badge-warning':'badge-danger'}`}>{f.status}</span></td>
                    <td>
                      {f.status !== 'Paid' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => { setPayModal(f); setPayForm({ amount: String(f.totalAmount - f.paidAmount), method: 'Cash', receiptNo: '' }); }}>
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {payModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setPayModal(null)}>
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <span className="modal-title">Record payment — {payModal.student.name}</span>
              <button className="modal-close" onClick={() => setPayModal(null)}>×</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>
              Balance: <strong>{fmt(payModal.totalAmount - payModal.paidAmount)}</strong>
            </div>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input className="form-input" type="number" required value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Payment method</label>
                <select className="form-select" value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}>
                  <option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>DD</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Receipt number</label>
                <input className="form-input" value={payForm.receiptNo} onChange={(e) => setPayForm({ ...payForm, receiptNo: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setPayModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Record payment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

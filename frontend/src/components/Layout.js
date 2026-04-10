import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navGroups = [
  {
    label: 'OVERVIEW',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: IconDashboard, exact: true }],
  },
  {
    label: 'ACADEMICS',
    items: [
      { to: '/dashboard/students',   label: 'Students',   icon: IconStudents },
      { to: '/dashboard/teachers',   label: 'Teachers',   icon: IconTeachers },
      { to: '/dashboard/attendance', label: 'Attendance', icon: IconAttendance },
      { to: '/dashboard/timetable',  label: 'Timetable',  icon: IconTimetable },
      { to: '/dashboard/results',    label: 'Results',    icon: IconResults },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { to: '/dashboard/fees',    label: 'Fees',    icon: IconFees },
      { to: '/dashboard/notices', label: 'Notices', icon: IconNotices },
    ],
  },
];

const PAGE_NAMES = {
  '/dashboard':            'Dashboard',
  '/dashboard/students':   'Students',
  '/dashboard/teachers':   'Teachers',
  '/dashboard/attendance': 'Attendance',
  '/dashboard/timetable':  'Timetable',
  '/dashboard/results':    'Results',
  '/dashboard/fees':       'Fees',
  '/dashboard/notices':    'Notices',
};

export default function Layout() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const pageTitle = PAGE_NAMES[location.pathname] || 'Dashboard';
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14V8l6-5 6 5v6H11v-4H7v4H3z" fill="white" />
            </svg>
          </div>
          <div className="logo-name">EduManage</div>
          <div className="logo-sub">School Management System</div>
        </div>

        {navGroups.map((group) => (
          <div key={group.label} className="sidebar-group">
            <div className="sidebar-group-label">{group.label}</div>
            {group.items.map(({ to, label, icon: Icon, badge, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Icon />
                {label}
                {badge && <span className="nav-badge">{badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-username" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Administrator'}
            </div>
            <div className="sidebar-role">{user?.role || 'admin'}</div>
          </div>
          <button
            onClick={logoutUser}
            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.45, padding: 4 }}
            title="Logout"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.4">
              <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3" strokeLinecap="round"/>
              <path d="M10 5l3 3-3 3M13 8H6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-area">
        <div className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">{pageTitle}</span>
            <span className="topbar-divider">|</span>
            <span className="topbar-crumb">2025–26 Academic Year</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-chip"><span className="chip-dot" />Term 2 Active</div>
            <div className="topbar-chip">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="1" y="2" width="11" height="9" rx="1" />
                <path d="M4 1v2M9 1v2M1 5.5h11" strokeLinecap="round" />
              </svg>
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="page-content fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────
function IconDashboard() {
  return <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>;
}
function IconStudents() {
  return <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="4.5" r="3"/><path d="M2 13c0-3.3 2.7-6 6-6s6 2.7 6 6H2z"/></svg>;
}
function IconTeachers() {
  return <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><circle cx="6" cy="4.5" r="2.5"/><path d="M1 12c0-2.8 2.2-5 5-5s5 2.2 5 5H1z"/><path d="M11.5 8l1.5 1.5L16 7" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>;
}
function IconAttendance() {
  return <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="3" width="14" height="11" rx="1.5"/><path d="M5 1v4M11 1v4M1 7h14" strokeLinecap="round"/></svg>;
}
function IconTimetable() {
  return <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5L10.5 11" strokeLinecap="round"/></svg>;
}
function IconResults() {
  return <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 13V7M6 13V4M9 13V9M12 13V2" strokeLinecap="round"/></svg>;
}
function IconFees() {
  return <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="3.5" width="14" height="9" rx="1.5"/><path d="M1 7h14"/><circle cx="5" cy="10" r="1" fill="currentColor" stroke="none"/></svg>;
}
function IconNotices() {
  return <svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 2h12a1 1 0 011 1v8a1 1 0 01-1 1H9l-3 2v-2H2a1 1 0 01-1-1V3a1 1 0 011-1z"/></svg>;
}
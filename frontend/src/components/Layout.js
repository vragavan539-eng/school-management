import React, { useState, useEffect } from 'react';
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
  const initials  = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const SidebarContent = () => (
    <>
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
    </>
  );

  return (
    <>
      <style>{`
        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          color: var(--text-primary);
          flex-shrink: 0;
        }
        .hamburger-btn:hover { background: var(--bg-secondary); }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .topbar-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mob-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 200;
          animation: fadeInOverlay .2s ease;
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; } to { opacity: 1; }
        }

        .mob-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 240px;
          z-index: 201;
          display: flex !important;
          flex-direction: column;
          overflow-y: auto;
          background: #0B1527 !important;
          box-shadow: 4px 0 24px rgba(0,0,0,0.4);
          animation: slideInDrawer .22s cubic-bezier(.16,1,.3,1);
        }
        @keyframes slideInDrawer {
          from { transform: translateX(-100%); } to { transform: translateX(0); }
        }

        .drawer-close {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 8px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          padding: 4px 8px;
          font-size: 18px;
          line-height: 1;
          z-index: 1;
        }
        .drawer-close:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }

        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          .main-area {
            margin-left: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            min-width: 0 !important;
          }
          .app-shell {
            overflow-x: hidden !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
          .topbar {
            padding: 0 14px !important;
            height: 52px;
          }
          .topbar-crumb   { display: none !important; }
          .topbar-divider { display: none !important; }
          .topbar-chip:last-child { display: none !important; }
          .page-content { padding: 12px 14px !important; }
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .grid-2, .grid-2-eq, .grid-3 { grid-template-columns: 1fr !important; }
          .table-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
          table { min-width: 520px; }
          .tt-grid { min-width: 560px; }
          .card { overflow-x: auto; }
          .search-bar { flex-wrap: wrap; }
          .search-bar .form-input { width: 100%; min-width: 0; }
          .stat-value { font-size: 20px !important; }
          .modal-overlay { align-items: flex-end !important; }
          .modal {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 18px 16px !important;
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            max-height: 85vh !important;
          }
          .login-card { padding: 28px 20px !important; margin: 16px !important; }
        }

        @media (max-width: 480px) {
          .stats-grid   { gap: 8px !important; }
          .stat-card    { padding: 12px 13px !important; }
          .topbar-title { font-size: 14px !important; }
          .card         { padding: 13px 14px !important; }
          .page-content { padding: 10px !important; }
          .avatar { width: 26px !important; height: 26px !important; font-size: 10px !important; }
        }
      `}</style>

      <div className="app-shell">

        {/* Desktop Sidebar — hidden on mobile via .desktop-sidebar */}
        <aside className="sidebar desktop-sidebar">
          <SidebarContent />
        </aside>

        {/* Mobile Drawer — only rendered when open */}
        {sidebarOpen && (
          <>
            <div className="mob-overlay" onClick={() => setSidebarOpen(false)} />
            <aside className="mob-drawer">
              <button className="drawer-close" onClick={() => setSidebarOpen(false)}>×</button>
              <SidebarContent />
            </aside>
          </>
        )}

        <div className="main-area">
          <div className="topbar">
            <div className="topbar-left">
              <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 5h14M3 10h14M3 15h14" />
                </svg>
              </button>
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
    </>
  );
}

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
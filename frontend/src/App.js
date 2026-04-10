import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home       from './pages/home';
import Layout     from './components/Layout';
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Students   from './pages/Students';
import Teachers   from './pages/Teachers';
import Attendance from './pages/Attendance';
import Results    from './pages/Results';
import Timetable  from './pages/Timetable';
import Fees       from './pages/Fees';
import Notices    from './pages/Notices';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index             element={<Dashboard />} />
            <Route path="students"   element={<Students />} />
            <Route path="teachers"   element={<Teachers />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="results"    element={<Results />} />
            <Route path="timetable"  element={<Timetable />} />
            <Route path="fees"       element={<Fees />} />
            <Route path="notices"    element={<Notices />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: 'admin@school.edu', password: 'admin123' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Animated star particles */}
      <div style={styles.starsSmall} />
      <div style={styles.starsMed} />
      <div style={styles.starsLarge} />

      {/* Aurora blobs */}
      <div style={{...styles.blob, ...styles.blob1}} />
      <div style={{...styles.blob, ...styles.blob2}} />
      <div style={{...styles.blob, ...styles.blob3}} />
      <div style={{...styles.blob, ...styles.blob4}} />

      {/* Grid overlay */}
      <div style={styles.grid} />

      <div style={styles.card}>

        {/* Back Button → Home */}
        <button
          style={styles.backBtn}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
          onClick={() => navigate('/')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Home
        </button>

        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoMark}>
            <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
              <path d="M3 14V8l6-5 6 5v6H11v-4H7v4H3z" fill="white" />
            </svg>
          </div>
          <div>
            <div style={styles.logoTitle}>EduManage</div>
            <div style={styles.logoSub}>School Management System</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email address</label>
            <input
              style={styles.input}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(139,92,246,0.8)';
                e.target.style.background = 'rgba(139,92,246,0.1)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.2)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                e.target.style.background = 'rgba(255,255,255,0.06)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="admin@school.edu"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(139,92,246,0.8)';
                e.target.style.background = 'rgba(139,92,246,0.1)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.2)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                e.target.style.background = 'rgba(255,255,255,0.06)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <button
            style={styles.submitBtn}
            type="submit"
            disabled={loading}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={styles.demoText}>Demo: admin@school.edu / admin123</p>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.15; }
        }
        @keyframes blob1Anim {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes blob2Anim {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.08); }
          66% { transform: translate(30px, -20px) scale(0.92); }
        }
        @keyframes blob3Anim {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, 35px) scale(1.05); }
        }
        @keyframes blob4Anim {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -25px) scale(1.07); }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(139,92,246,0.5); }
          50% { box-shadow: 0 0 28px rgba(139,92,246,0.9), 0 0 50px rgba(56,189,248,0.3); }
        }
        @keyframes starsAnim {
          from { background-position: 0 0; }
          to   { background-position: -1000px 500px; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 20% 50%, #0d0221 0%, #050011 40%, #000308 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'sans-serif',
  },

  // Star layers
  starsSmall: {
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundImage: 'radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 25% 60%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 40% 30%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 55% 80%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(1px 1px at 60% 45%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 35% 95%, rgba(255,255,255,0.7) 0%, transparent 100%)',
    backgroundSize: '400px 300px',
    animation: 'starsAnim 80s linear infinite',
    opacity: 0.7,
  },
  starsMed: {
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundImage: 'radial-gradient(1.5px 1.5px at 20% 40%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 50% 10%, rgba(200,180,255,0.8) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 75% 65%, rgba(180,220,255,0.7) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 5% 70%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 90% 85%, rgba(200,255,240,0.7) 0%, transparent 100%)',
    backgroundSize: '600px 400px',
    animation: 'starsAnim 120s linear infinite reverse',
    opacity: 0.6,
  },
  starsLarge: {
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundImage: 'radial-gradient(2px 2px at 30% 25%, rgba(255,255,255,0.9) 0%, transparent 100%), radial-gradient(2px 2px at 65% 70%, rgba(220,200,255,0.8) 0%, transparent 100%), radial-gradient(2px 2px at 80% 35%, rgba(180,230,255,0.9) 0%, transparent 100%), radial-gradient(2px 2px at 10% 55%, rgba(255,220,200,0.7) 0%, transparent 100%)',
    backgroundSize: '800px 600px',
    animation: 'starsAnim 60s linear infinite',
    opacity: 0.8,
  },

  // Aurora blobs
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    zIndex: 0,
  },
  blob1: {
    width: 500, height: 500,
    background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
    top: '-150px', left: '-100px',
    animation: 'blob1Anim 12s ease-in-out infinite',
  },
  blob2: {
    width: 400, height: 400,
    background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)',
    bottom: '-100px', right: '-80px',
    animation: 'blob2Anim 15s ease-in-out infinite',
  },
  blob3: {
    width: 300, height: 300,
    background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
    bottom: '100px', left: '50px',
    animation: 'blob3Anim 10s ease-in-out infinite',
  },
  blob4: {
    width: 250, height: 250,
    background: 'radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)',
    top: '80px', right: '100px',
    animation: 'blob4Anim 13s ease-in-out infinite',
  },

  // Subtle grid
  grid: {
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
  },

  card: {
    position: 'relative', zIndex: 2,
    background: 'rgba(255,255,255,0.045)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 22,
    padding: '36px 32px',
    width: 340,
    boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
    animation: 'cardEntrance 0.6s ease forwards, cardFloat 7s ease-in-out 0.6s infinite',
  },

  backBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13, cursor: 'pointer',
    marginBottom: 22, padding: '6px 12px',
    transition: 'all 0.2s',
  },

  logoRow: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
  },
  logoMark: {
    width: 44, height: 44,
    background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)',
    borderRadius: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    animation: 'logoPulse 3s ease-in-out infinite',
  },
  logoTitle: { fontSize: 20, fontWeight: 600, color: '#fff', letterSpacing: '-0.3px' },
  logoSub:   { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 },

  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 6 },

  input: {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10, padding: '10px 14px',
    color: '#fff', fontSize: 14, outline: 'none',
    transition: 'all 0.25s',
  },

  errorBox: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#fca5a5',
    padding: '9px 12px', borderRadius: 8,
    fontSize: 12, marginBottom: 14,
  },

  submitBtn: {
    width: '100%', padding: '12px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)',
    border: 'none', borderRadius: 12,
    color: '#fff', fontSize: 14, fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.25s',
    boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
  },

  demoText: {
    textAlign: 'center', fontSize: 11,
    color: 'rgba(255,255,255,0.3)', marginTop: 16,
  },
};

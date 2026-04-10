import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function useCounter(target, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function StatCard({ value, suffix, label, color, delay, start }) {
  const count = useCounter(value, 2200, start);
  return (
    <div style={{ textAlign: 'center', padding: '22px 12px', opacity: start ? 1 : 0, transform: start ? 'none' : 'translateY(30px)', transition: `opacity .7s ${delay}ms, transform .7s ${delay}ms` }}>
      <div style={{ fontSize: 'clamp(28px,6vw,44px)', fontWeight: 800, color, fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{count.toLocaleString()}{suffix}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 7, letterSpacing: '.07em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

const FEATURES = [
  { icon: '🎓', title: 'Student Management',  desc: 'Complete profiles, parent contacts, admission records and academic history in one place.', color: '#1D9E75' },
  { icon: '👨‍🏫', title: 'Teacher Management', desc: 'Staff profiles, subject assignments, schedules and leave tracking — all streamlined.',   color: '#378ADD' },
  { icon: '📅', title: 'Smart Attendance',     desc: 'One-click daily marking, monthly calendar view, automatic percentage calculation.',        color: '#EF9F27' },
  { icon: '📊', title: 'Results & Grades',     desc: 'Upload marks, auto-compute grades and ranks, generate printable report cards.',             color: '#D4537E' },
  { icon: '🕐', title: 'Timetable Builder',    desc: 'Visual weekly timetables for every class, section and teacher — conflict-free.',            color: '#7F77DD' },
  { icon: '💰', title: 'Fee Management',       desc: 'Payment tracking, instant receipts, overdue alerts and full collection reports.',           color: '#0F9E6E' },
];

const TESTIMONIALS = [
  { name: 'Dr. Rajesh Kumar',     role: 'Principal, Sri Venkateswara School', text: 'EduManage transformed how we run our school. Attendance and fees are now fully automated. We save 3 hours every day.',            avatar: 'RK', color: '#1D9E75' },
  { name: 'Priya Subramaniam',   role: 'Admin, Bharathi Vidyalaya',           text: 'The dashboard gives a complete picture every morning. Parent communication is seamless and results are published instantly.',       avatar: 'PS', color: '#378ADD' },
  { name: 'Anand Krishnamurthy', role: 'HOD, Chennai Public School',          text: 'Result management that used to take 3 days now takes 20 minutes. The rank calculation is automatic. Absolutely incredible.',       avatar: 'AK', color: '#EF9F27' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);
  const [featRef,  featInView]  = useInView(0.1);
  const [whyRef,   whyInView]   = useInView(0.15);
  const [testiRef, testiInView] = useInView(0.1);
  const [ctaRef,   ctaInView]   = useInView(0.3);

  const handleSignIn = () => navigate('/login');

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: '#060d1a', color: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#060d1a}
        ::-webkit-scrollbar-thumb{background:#1D9E75;border-radius:2px}
        @keyframes floatA{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-20px) rotate(4deg)}}
        @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(16px)}}
        @keyframes floatC{0%,100%{transform:translateY(-8px)}50%{transform:translateY(10px)}}
        @keyframes pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.7;transform:scale(1.1)}}
        @keyframes gradMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes slideUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .h-anim{animation:slideUp .85s cubic-bezier(.16,1,.3,1) both}
        .fade-anim{animation:fadeIn .7s ease both}
        .feat-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:24px 20px;transition:transform .25s,border-color .25s,background .25s}
        .feat-card:hover{transform:translateY(-7px);background:rgba(255,255,255,.06);border-color:rgba(29,158,117,.4)}
        .testi-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:24px 20px;transition:transform .25s,border-color .25s}
        .testi-card:hover{transform:translateY(-5px);border-color:rgba(29,158,117,.3)}
        .nav-link{color:rgba(255,255,255,.55);font-size:14px;font-weight:500;cursor:pointer;transition:color .15s;position:relative;padding:4px 0}
        .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1.5px;background:#1D9E75;transition:width .2s}
        .nav-link:hover{color:#fff}
        .nav-link:hover::after{width:100%}
        .btn-p{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 28px;border-radius:11px;border:none;background:linear-gradient(135deg,#1D9E75,#0a5c45);color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 20px rgba(29,158,117,.3)}
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(29,158,117,.45)}
        .btn-g{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 28px;border-radius:11px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;transition:border-color .15s,background .15s}
        .btn-g:hover{border-color:rgba(255,255,255,.45);background:rgba(255,255,255,.06)}
        .gline{height:1px;background:linear-gradient(90deg,transparent,rgba(29,158,117,.35),transparent)}

        /* ── MOBILE ── */
        @media(max-width:768px){
          .nav-links-desktop{display:none!important}
          .nav-btns-desktop{display:none!important}
          .hamburger{display:flex!important}
          .hero-section{padding:110px 20px 60px!important}
          .hero-title{font-size:clamp(32px,9vw,52px)!important}
          .hero-sub{font-size:15px!important}
          .hero-buttons{flex-direction:column!important;align-items:stretch!important}
          .hero-buttons button{width:100%!important;justify-content:center!important}
          .live-bar{flex-direction:column!important;gap:0!important}
          .live-bar-item{border-right:none!important;border-bottom:1px solid rgba(255,255,255,.07)!important}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
          .stats-grid > div{border-right:none!important;border-bottom:1px solid rgba(255,255,255,.06)!important}
          .features-section{padding:60px 20px!important}
          .why-grid{grid-template-columns:1fr!important;gap:32px!important}
          .why-visual{display:none!important}
          .testi-grid{grid-template-columns:1fr!important}
          .cta-section{padding:70px 20px!important}
          .cta-title{font-size:clamp(28px,8vw,42px)!important}
          .footer-inner{flex-direction:column!important;align-items:flex-start!important;gap:14px!important}
          .features-grid{grid-template-columns:1fr!important}
          .section-pad{padding:60px 20px!important}
        }
        @media(min-width:769px){
          .hamburger{display:none!important}
          .mobile-menu{display:none!important}
        }
        @media(max-width:480px){
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
          .live-bar{display:none!important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',height:64,background:scrollY>60||menuOpen?'rgba(6,13,26,.97)':'transparent',backdropFilter:scrollY>60||menuOpen?'blur(18px)':'none',borderBottom:scrollY>60?'1px solid rgba(255,255,255,.06)':'none',transition:'background .3s' }}>
        {/* Logo */}
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:36,height:36,background:'linear-gradient(135deg,#1D9E75,#0a5c45)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 18px rgba(29,158,117,.45)',flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 14V8l6-5 6 5v6H11v-4H7v4H3z" fill="white"/></svg>
          </div>
          <span style={{ fontSize:16,fontWeight:700,color:'#fff',letterSpacing:'-.01em' }}>EduManage</span>
        </div>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ display:'flex',alignItems:'center',gap:32 }}>
          {['Features','About','Contact'].map(l=><span key={l} className="nav-link" onClick={()=>document.getElementById(l.toLowerCase())?.scrollIntoView({behavior:'smooth'})}>{l}</span>)}
        </div>

        {/* Desktop buttons */}
        <div className="nav-btns-desktop" style={{ display:'flex',gap:10 }}>
          <button className="btn-g" style={{ padding:'8px 20px',fontSize:14 }} onClick={handleSignIn}>Sign in</button>
          <button className="btn-p" style={{ padding:'8px 20px',fontSize:14 }} onClick={handleSignIn}>Get Started →</button>
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={()=>setMenuOpen(!menuOpen)} style={{ background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',gap:5,padding:8 }}>
          <span style={{ display:'block',width:22,height:2,background:'#fff',borderRadius:2,transition:'transform .2s',transform:menuOpen?'rotate(45deg) translate(5px,5px)':'none' }} />
          <span style={{ display:'block',width:22,height:2,background:'#fff',borderRadius:2,opacity:menuOpen?0:1,transition:'opacity .2s' }} />
          <span style={{ display:'block',width:22,height:2,background:'#fff',borderRadius:2,transition:'transform .2s',transform:menuOpen?'rotate(-45deg) translate(5px,-5px)':'none' }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{ position:'fixed',top:64,left:0,right:0,background:'rgba(6,13,26,.97)',backdropFilter:'blur(18px)',zIndex:99,padding:'20px 24px',borderBottom:'1px solid rgba(255,255,255,.08)',display:'flex',flexDirection:'column',gap:16 }}>
          {['Features','About','Contact'].map(l=>(
            <span key={l} style={{ color:'rgba(255,255,255,.7)',fontSize:16,fontWeight:500,cursor:'pointer',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.06)' }}
              onClick={()=>{ document.getElementById(l.toLowerCase())?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false); }}>{l}</span>
          ))}
          <button className="btn-g" style={{ width:'100%',marginTop:4 }} onClick={()=>{ handleSignIn(); setMenuOpen(false); }}>Sign in</button>
          <button className="btn-p" style={{ width:'100%' }} onClick={()=>{ handleSignIn(); setMenuOpen(false); }}>Get Started →</button>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero-section" style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'130px 48px 80px',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 75% 55% at 50% 20%,rgba(29,158,117,.13) 0%,transparent 70%),radial-gradient(ellipse 55% 45% at 80% 70%,rgba(55,138,221,.09) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute',inset:0,opacity:.025,backgroundImage:'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',backgroundSize:'48px 48px' }} />

        <div style={{ position:'relative',zIndex:1,textAlign:'center',maxWidth:800,width:'100%' }}>
          <div className="fade-anim" style={{ animationDelay:'.05s',display:'inline-flex',alignItems:'center',gap:8,background:'rgba(29,158,117,.12)',border:'1px solid rgba(29,158,117,.3)',borderRadius:30,padding:'6px 14px',marginBottom:24,flexWrap:'wrap',justifyContent:'center' }}>
            <span style={{ width:7,height:7,borderRadius:'50%',background:'#1D9E75',display:'inline-block',animation:'pulse 2s ease-in-out infinite',flexShrink:0 }} />
            <span style={{ fontSize:11,color:'#5DCAA5',fontWeight:700,letterSpacing:'.05em' }}>🏫 SCHOOL MANAGEMENT PLATFORM — 2026</span>
          </div>

          <h1 className="h-anim hero-title" style={{ animationDelay:'.1s',fontSize:'clamp(36px,8vw,64px)',fontWeight:800,lineHeight:1.08,marginBottom:20,fontFamily:"'Playfair Display',serif",letterSpacing:'-.025em' }}>
            The smarter way<br />
            <span style={{ background:'linear-gradient(135deg,#1D9E75 0%,#5DCAA5 40%,#378ADD 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',backgroundSize:'200%',animation:'gradMove 4s ease infinite' }}>
              to run your school
            </span>
          </h1>

          <p className="h-anim hero-sub" style={{ animationDelay:'.22s',fontSize:17,color:'rgba(255,255,255,.52)',lineHeight:1.75,maxWidth:540,margin:'0 auto 32px' }}>
            EduManage brings students, teachers, attendance, results and fees into one beautiful, powerful platform — saving your staff hours every single day.
          </p>

          <div className="h-anim hero-buttons" style={{ animationDelay:'.34s',display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
            <button className="btn-p" onClick={handleSignIn}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="white"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="white"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="white"/></svg>
              Open Dashboard
            </button>
            <button className="btn-g" onClick={()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>
              Explore Features ↓
            </button>
          </div>

          <div className="h-anim live-bar" style={{ animationDelay:'.46s',marginTop:40,display:'inline-flex',alignItems:'center',gap:0,background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.09)',borderRadius:14,overflow:'hidden',maxWidth:'100%' }}>
            {[['✅','Attendance marked','2 min ago'],['📝','Result uploaded','5 min ago'],['💸','Fee collected','8 min ago']].map(([ic,txt,time],i)=>(
              <div key={txt} className="live-bar-item" style={{ display:'flex',alignItems:'center',gap:10,padding:'12px 16px',borderRight:i<2?'1px solid rgba(255,255,255,.07)':'none' }}>
                <span style={{ fontSize:16 }}>{ic}</span>
                <div>
                  <div style={{ fontSize:11,color:'#fff',fontWeight:600,whiteSpace:'nowrap' }}>{txt}</div>
                  <div style={{ fontSize:10,color:'rgba(255,255,255,.32)' }}>{time}</div>
                </div>
              </div>
            ))}
            <div style={{ padding:'12px 14px',display:'flex',alignItems:'center',gap:7 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'#1D9E75',animation:'pulse 2s infinite',display:'inline-block',flexShrink:0 }} />
              <span style={{ fontSize:11,color:'#5DCAA5',fontWeight:700 }}>Live</span>
            </div>
          </div>
        </div>
      </section>

      <div className="gline" />

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ background:'rgba(29,158,117,.04)',padding:'8px 16px' }}>
        <div className="stats-grid" style={{ maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)' }}>
          {[
            {value:1248,suffix:'+',label:'Students Enrolled', color:'#5DCAA5',delay:0},
            {value:64,  suffix:'', label:'Expert Teachers',   color:'#7BBEF5',delay:110},
            {value:98,  suffix:'%',label:'Parent Satisfaction',color:'#FAC775',delay:220},
            {value:12,  suffix:'', label:'Classes & Sections', color:'#F09595',delay:330},
          ].map((s,i)=>(
            <div key={s.label} style={{ borderRight:i<3?'1px solid rgba(255,255,255,.06)':'none' }}>
              <StatCard {...s} start={statsInView} />
            </div>
          ))}
        </div>
      </section>

      <div className="gline" />

      {/* ── FEATURES ── */}
      <section id="features" ref={featRef} className="features-section section-pad" style={{ padding:'80px 48px' }}>
        <div style={{ textAlign:'center',marginBottom:48,opacity:featInView?1:0,transform:featInView?'none':'translateY(22px)',transition:'opacity .6s,transform .6s' }}>
          <div style={{ display:'inline-block',background:'rgba(29,158,117,.12)',border:'1px solid rgba(29,158,117,.25)',color:'#5DCAA5',fontSize:11,fontWeight:700,padding:'5px 16px',borderRadius:30,marginBottom:14,letterSpacing:'.08em' }}>FEATURES</div>
          <h2 style={{ fontSize:'clamp(28px,6vw,44px)',fontWeight:800,fontFamily:"'Playfair Display',serif",marginBottom:12,letterSpacing:'-.02em' }}>Everything your school needs</h2>
          <p style={{ fontSize:15,color:'rgba(255,255,255,.4)',maxWidth:420,margin:'0 auto' }}>One platform. Every department. Zero chaos.</p>
        </div>
        <div className="features-grid" style={{ maxWidth:1080,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16 }}>
          {FEATURES.map((f,i)=>(
            <div key={f.title} className="feat-card" style={{ opacity:featInView?1:0,transform:featInView?'none':'translateY(32px)',transition:`opacity .6s ${i*80}ms,transform .6s ${i*80}ms` }}>
              <div style={{ fontSize:30,marginBottom:14,width:52,height:52,display:'flex',alignItems:'center',justifyContent:'center',background:`${f.color}18`,borderRadius:13 }}>{f.icon}</div>
              <div style={{ fontSize:15,fontWeight:700,color:'#fff',marginBottom:9 }}>{f.title}</div>
              <div style={{ fontSize:13,color:'rgba(255,255,255,.44)',lineHeight:1.72 }}>{f.desc}</div>
              <div style={{ marginTop:16,display:'flex',alignItems:'center',gap:6,color:f.color,fontSize:13,fontWeight:700 }}>Learn more <span>→</span></div>
            </div>
          ))}
        </div>
      </section>

      <div className="gline" />

      {/* ── WHY ── */}
      <section id="about" ref={whyRef} className="section-pad" style={{ padding:'80px 48px',background:'rgba(255,255,255,.015)' }}>
        <div className="why-grid" style={{ maxWidth:1080,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:56,alignItems:'center' }}>
          <div style={{ opacity:whyInView?1:0,transform:whyInView?'none':'translateX(-30px)',transition:'opacity .7s,transform .7s' }}>
            <div style={{ display:'inline-block',background:'rgba(55,138,221,.12)',border:'1px solid rgba(55,138,221,.25)',color:'#7BBEF5',fontSize:11,fontWeight:700,padding:'5px 16px',borderRadius:30,marginBottom:14,letterSpacing:'.08em' }}>WHY EDUMANAGE</div>
            <h2 style={{ fontSize:'clamp(26px,5vw,40px)',fontWeight:800,fontFamily:"'Playfair Display',serif",marginBottom:16,lineHeight:1.2 }}>Built for Tamil Nadu schools</h2>
            <p style={{ fontSize:14,color:'rgba(255,255,255,.48)',lineHeight:1.8,marginBottom:22 }}>
              Designed from the ground up for the way Indian schools work — term structure, Tamil medium, and fee systems that match your school's reality.
            </p>
            {[
              'Works offline — no constant internet needed',
              'Government-format report cards built in',
              'Data stays on your server — fully private',
              'SMS & WhatsApp parent alerts included',
            ].map(t=>(
              <div key={t} style={{ display:'flex',alignItems:'flex-start',gap:11,marginBottom:12 }}>
                <span style={{ color:'#1D9E75',fontSize:14,fontWeight:800,flexShrink:0,marginTop:2 }}>✓</span>
                <span style={{ fontSize:13,color:'rgba(255,255,255,.58)',lineHeight:1.65 }}>{t}</span>
              </div>
            ))}
            <button className="btn-p" style={{ marginTop:14 }} onClick={handleSignIn}>Start Free Today →</button>
          </div>

          <div className="why-visual" style={{ opacity:whyInView?1:0,transform:whyInView?'none':'translateX(30px)',transition:'opacity .7s .1s,transform .7s .1s',position:'relative' }}>
            <div style={{ background:'rgba(29,158,117,.06)',border:'1px solid rgba(29,158,117,.15)',borderRadius:20,padding:22 }}>
              <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:16 }}>
                {['#E24B4A','#EF9F27','#1D9E75'].map(c=><div key={c} style={{ width:10,height:10,borderRadius:'50%',background:c }} />)}
                <div style={{ flex:1,height:20,background:'rgba(255,255,255,.04)',borderRadius:4,marginLeft:6 }} />
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:13 }}>
                {[['1,248','Students','#5DCAA5'],['91%','Attendance','#7BBEF5'],['₹18.6L','Collected','#FAC775'],['3','Notices','#F09595']].map(([v,l,c])=>(
                  <div key={l} style={{ background:'rgba(255,255,255,.04)',borderRadius:10,padding:'12px 14px' }}>
                    <div style={{ fontSize:20,fontWeight:800,color:c }}>{v}</div>
                    <div style={{ fontSize:11,color:'rgba(255,255,255,.32)',marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(255,255,255,.03)',borderRadius:10,padding:'12px 14px' }}>
                <div style={{ fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:10,fontWeight:700,letterSpacing:'.06em' }}>WEEKLY ATTENDANCE</div>
                <div style={{ display:'flex',alignItems:'flex-end',gap:6,height:48 }}>
                  {[88,92,89,95,91,87].map((h,i)=>(
                    <div key={i} style={{ flex:1,background:`rgba(29,158,117,${.28+i*.09})`,borderRadius:'3px 3px 0 0',height:`${h}%` }} />
                  ))}
                </div>
                <div style={{ display:'flex',justifyContent:'space-between',marginTop:5 }}>
                  {['M','T','W','T','F','S'].map((d,i)=><span key={i} style={{ fontSize:10,color:'rgba(255,255,255,.22)' }}>{d}</span>)}
                </div>
              </div>
            </div>
            <div style={{ position:'absolute',top:-16,right:-16,background:'linear-gradient(135deg,#1D9E75,#0a5c45)',borderRadius:13,padding:'10px 14px',boxShadow:'0 8px 28px rgba(29,158,117,.45)',animation:'floatA 5s ease-in-out infinite' }}>
              <div style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,.8)' }}>🎉 Fee Collected</div>
              <div style={{ fontSize:15,fontWeight:800,color:'#fff' }}>₹24,000</div>
            </div>
            <div style={{ position:'absolute',bottom:-16,left:-16,background:'#0b1629',border:'1px solid rgba(255,255,255,.1)',borderRadius:13,padding:'10px 14px',animation:'floatB 6s ease-in-out infinite' }}>
              <div style={{ fontSize:11,color:'rgba(255,255,255,.42)' }}>Rank updated</div>
              <div style={{ fontSize:13,fontWeight:700,color:'#fff' }}>🏆 Arjun — Rank 1</div>
            </div>
          </div>
        </div>
      </section>

      <div className="gline" />

      {/* ── TESTIMONIALS ── */}
      <section id="contact" ref={testiRef} className="section-pad" style={{ padding:'80px 48px' }}>
        <div style={{ textAlign:'center',marginBottom:44,opacity:testiInView?1:0,transform:testiInView?'none':'translateY(22px)',transition:'opacity .6s,transform .6s' }}>
          <div style={{ display:'inline-block',background:'rgba(212,83,126,.12)',border:'1px solid rgba(212,83,126,.25)',color:'#ED93B1',fontSize:11,fontWeight:700,padding:'5px 16px',borderRadius:30,marginBottom:14,letterSpacing:'.08em' }}>TESTIMONIALS</div>
          <h2 style={{ fontSize:'clamp(26px,6vw,40px)',fontWeight:800,fontFamily:"'Playfair Display',serif",letterSpacing:'-.02em' }}>Trusted by schools across Tamil Nadu</h2>
        </div>
        <div className="testi-grid" style={{ maxWidth:980,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18 }}>
          {TESTIMONIALS.map((t,i)=>(
            <div key={t.name} className="testi-card" style={{ opacity:testiInView?1:0,transform:testiInView?'none':'translateY(30px)',transition:`opacity .6s ${i*100}ms,transform .6s ${i*100}ms` }}>
              <div style={{ fontSize:36,color:'rgba(255,255,255,.07)',fontFamily:'serif',lineHeight:1,marginBottom:10 }}>"</div>
              <p style={{ fontSize:13,color:'rgba(255,255,255,.55)',lineHeight:1.78,marginBottom:20 }}>{t.text}</p>
              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <div style={{ width:40,height:40,borderRadius:'50%',background:`${t.color}1e`,border:`1px solid ${t.color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:t.color,flexShrink:0 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize:13,fontWeight:700,color:'#fff' }}>{t.name}</div>
                  <div style={{ fontSize:11,color:'rgba(255,255,255,.32)',marginTop:2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="gline" />

      {/* ── CTA ── */}
      <section ref={ctaRef} className="cta-section section-pad" style={{ padding:'90px 48px',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 65% 60% at 50% 50%,rgba(29,158,117,.1) 0%,transparent 70%)' }} />
        <div style={{ position:'relative',zIndex:1,opacity:ctaInView?1:0,transform:ctaInView?'none':'translateY(32px)',transition:'opacity .7s,transform .7s' }}>
          <h2 className="cta-title" style={{ fontSize:'clamp(30px,7vw,50px)',fontWeight:800,fontFamily:"'Playfair Display',serif",marginBottom:14,letterSpacing:'-.025em',lineHeight:1.1 }}>
            Ready to transform<br />your school?
          </h2>
          <p style={{ fontSize:16,color:'rgba(255,255,255,.4)',marginBottom:34 }}>Join 200+ schools already using EduManage across Tamil Nadu</p>
          <div style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
            <button className="btn-p" style={{ fontSize:15,padding:'13px 32px' }} onClick={handleSignIn}>🚀 Open Dashboard</button>
            <button className="btn-g" style={{ fontSize:15,padding:'13px 32px' }} onClick={handleSignIn}>View Demo</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#030810',borderTop:'1px solid rgba(255,255,255,.06)',padding:'28px 24px' }}>
        <div className="footer-inner" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ width:26,height:26,background:'#1D9E75',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none"><path d="M3 14V8l6-5 6 5v6H11v-4H7v4H3z" fill="white"/></svg>
            </div>
            <span style={{ fontSize:14,fontWeight:700,color:'#fff' }}>EduManage</span>
            <span style={{ fontSize:12,color:'rgba(255,255,255,.22)',marginLeft:2 }}>— School Management System</span>
          </div>
          <div style={{ display:'flex',gap:20,flexWrap:'wrap' }}>
            {['Features','Privacy','Contact'].map(l=>(
              <span key={l} style={{ fontSize:13,color:'rgba(255,255,255,.32)',cursor:'pointer' }}>{l}</span>
            ))}
          </div>
          <span style={{ fontSize:11,color:'rgba(255,255,255,.18)' }}>© 2026 EduManage. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const T = {
  bg:          "#0A0A0A",
  surface:     "#111111",
  surface2:    "#161616",
  surface3:    "#1A1A1A",
  green:       "#00C853",
  greenDeep:   "#1B5E20",
  greenMid:    "#00A846",
  greenDim:    "rgba(0,200,83,0.12)",
  greenGlow:   "rgba(0,200,83,0.25)",
  greenGlow2:  "rgba(0,200,83,0.08)",
  white:       "#FFFFFF",
  gray:        "#A0A0A0",
  grayD:       "#2A2A2A",
  border:      "rgba(255,255,255,0.08)",
  borderGreen: "rgba(0,200,83,0.3)",
  red:         "#FF3B30",
  orange:      "#FF9500",
  glass:       "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
};

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif`;

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES INJECTED
═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0A0A0A; }
  ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
  input { outline: none; }
  button { outline: none; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.85); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes greenPulse {
    0%   { box-shadow: 0 0 0 0 rgba(0,200,83,0.4); }
    70%  { box-shadow: 0 0 0 10px rgba(0,200,83,0); }
    100% { box-shadow: 0 0 0 0 rgba(0,200,83,0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes liveGlow {
    0%, 100% { box-shadow: 0 0 6px 2px rgba(0,200,83,0.6); }
    50%       { box-shadow: 0 0 14px 4px rgba(0,200,83,0.3); }
  }
  .fadeUp  { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .fadeUp2 { animation: fadeUp 0.45s 0.08s cubic-bezier(0.16,1,0.3,1) both; }
  .fadeUp3 { animation: fadeUp 0.45s 0.16s cubic-bezier(0.16,1,0.3,1) both; }
  .fadeUp4 { animation: fadeUp 0.45s 0.24s cubic-bezier(0.16,1,0.3,1) both; }

  .card-hover {
    transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease;
  }
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,200,83,0.12);
  }
  .btn-press:active { transform: scale(0.97); }
  .live-badge { animation: liveGlow 2s ease-in-out infinite; }
`;

/* ═══════════════════════════════════════════════════════════════
   SAMPLE DATA
═══════════════════════════════════════════════════════════════ */
const SAMPLE_PATIENT = { id: 1, name: "Alex Johnson", week: 3, phase: 1, surgeryDate: "2026-04-01", compliance: 87, lastSession: "Apr 20", flagged: false };

const CLINICIAN_PATIENTS = [
  { id: 1, name: "Alex Johnson",  phase: 1, week: 3, lastSession: "Apr 20", compliance: 87, flagged: false, trend: "up" },
  { id: 2, name: "Maria Santos",  phase: 2, week: 5, lastSession: "Apr 19", compliance: 72, flagged: true,  trend: "down" },
  { id: 3, name: "Derek Okafor",  phase: 1, week: 2, lastSession: "Apr 21", compliance: 95, flagged: false, trend: "up" },
  { id: 4, name: "Priya Nair",    phase: 2, week: 6, lastSession: "Apr 18", compliance: 61, flagged: true,  trend: "down" },
];

const PHASE1_EXERCISES = [
  { id: 1, name: "Lying Heel Slides",       sets: "3 × 15", metric: "ROM (°)",            phase: 1, done: true },
  { id: 2, name: "Seated Heel Slides",       sets: "3 × 15", metric: "ROM (°)",            phase: 1, done: true },
  { id: 3, name: "Straight Leg Raises",      sets: "3 × 10", metric: "Symmetry (%)",       phase: 1, done: true },
  { id: 4, name: "Long Arc Quad",            sets: "3 × 15", metric: "Peak Extension (°)", phase: 1, done: false },
  { id: 5, name: "Air Squats (60°)",         sets: "3 × 12", metric: "Depth (°)",          phase: 1, done: false },
  { id: 6, name: "Air Squats (30°)",         sets: "3 × 12", metric: "Symmetry (%)",       phase: 1, done: false },
];

const PHASE2_EXERCISES = [
  { id: 7,  name: "Single Leg Squat 50%",   sets: "3 × 10", metric: "Symmetry (%)",    phase: 2, done: true },
  { id: 8,  name: "Single Leg Squat Max",   sets: "3 × 8",  metric: "Peak Flexion (°)",phase: 2, done: false },
  { id: 9,  name: "Step-Ups",               sets: "3 × 12", metric: "Hip Stability (°)",phase: 2, done: false },
  { id: 10, name: "Forward Lunges",         sets: "3 × 10", metric: "Symmetry (%)",    phase: 2, done: false },
];

const ROM_DATA  = [65, 68, 72, 76, 80, 85, 90, 95, 100, 105, 110, 113, 115];
const SYM_DATA  = [73, 75, 78, 80, 82, 84, 86, 87, 89,  90,  91,  92,  93];

/* ═══════════════════════════════════════════════════════════════
   ICONS (inline SVG — Lucide-style)
═══════════════════════════════════════════════════════════════ */
const Icon = ({ name, size = 20, color = T.gray, style = {} }) => {
  const paths = {
    home:     <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></>,
    program:  <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>,
    record:   <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/></>,
    chart:    <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    person:   <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>,
    patients: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    analytics:<><path d="M18 20V10M12 20V4M6 20v-6"/></>,
    messages: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>,
    check:    <><polyline points="20 6 9 17 4 12"/></>,
    flag:     <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    arrow:    <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    chevron:  <><polyline points="9 18 15 12 9 6"/></>,
    back:     <><polyline points="15 18 9 12 15 6"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trophy:   <><path d="M6 9H4a2 2 0 000 4h2"/><path d="M18 9h2a2 2 0 010 4h-2"/><path d="M6 9V5h12v4"/><path d="M12 17v4M8 21h8"/><path d="M6 9a6 6 0 0012 0"/></>,
    zap:      <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    target:   <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    timer:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    play:     <><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></>,
    camera:   <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></>,
    alert:    <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    medal:    <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    bone:     <><path d="M18.5 9.5a2.5 2.5 0 010-5 2.5 2.5 0 012.5 2.5c0 1-.4 1.9-1 2.6L12 17.4l-8-7.8C3.4 8.9 3 8 3 7a2.5 2.5 0 015 0c0 .5-.15 1-.4 1.4L12 13l4.4-4.6c-.25-.4-.4-.9-.4-1.4z"/></>,
    info:     <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    star:     <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]}
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════
   VALOR LOGO
═══════════════════════════════════════════════════════════════ */
function ValorLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00C853"/>
          <stop offset="100%" stopColor="#1B5E20"/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#logoGrad)"/>
      <path d="M12 16L24 36L36 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="24" cy="36" r="3" fill="rgba(255,255,255,0.8)"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CIRCULAR PROGRESS RING
═══════════════════════════════════════════════════════════════ */
function ProgressRing({ value, max = 100, size = 80, strokeWidth = 6, color = T.green, label, sublabel }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.grayD} strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)", filter: `drop-shadow(0 0 6px ${color}80)` }}/>
      </svg>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        {label && <div style={{ color: color, fontWeight: 900, fontSize: size > 80 ? 22 : 16, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{label}</div>}
        {sublabel && <div style={{ color: T.gray, fontSize: 9, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED NUMBER
═══════════════════════════════════════════════════════════════ */
function AnimNum({ value, suffix = "", decimals = 0, style = {} }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(+(start + (end - start) * ease).toFixed(decimals));
      if (t < 1) requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <span style={style}>{display}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   LINE CHART (smooth, dark)
═══════════════════════════════════════════════════════════════ */
function Chart({ data, color = T.green, height = 120, label = "c", minVal, maxVal, showDots = true, curved = true }) {
  const W = 340, H = height;
  const pad = { t: 12, b: 28, l: 34, r: 12 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const mn = minVal !== undefined ? minVal : Math.min(...data) - 5;
  const mx = maxVal !== undefined ? maxVal : Math.max(...data) + 5;

  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * cw,
    y: pad.t + ch - ((v - mn) / (mx - mn)) * ch,
  }));

  // Smooth bezier path
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const c1x = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${c1x} ${pts[i-1].y}, ${c1x} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
  }

  // Area path
  const area = `${d} L ${pts[pts.length-1].x} ${pad.t+ch} L ${pts[0].x} ${pad.t+ch} Z`;
  const gradId = `g${label}`;
  const peakIdx = data.indexOf(Math.max(...data));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = pad.t + f * ch;
        const v = Math.round(mx - f * (mx - mn));
        return <g key={i}>
          <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <text x={pad.l - 5} y={y + 4} textAnchor="end" fill={T.gray} fontSize="9" fontFamily={font}>{v}</text>
        </g>;
      })}
      {/* X axis labels */}
      {pts.map((_, i) => {
        if (data.length > 8 && i % 3 !== 0) return null;
        return <text key={i} x={pts[i].x} y={H - 4} textAnchor="middle" fill={T.gray} fontSize="9" fontFamily={font}>W{Math.ceil((i + 1) * 6 / data.length)}</text>;
      })}
      {/* Area */}
      <path d={area} fill={`url(#${gradId})`}/>
      {/* Line */}
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}/>
      {/* Peak glow */}
      {showDots && <circle cx={pts[peakIdx].x} cy={pts[peakIdx].y} r="8" fill={color} fillOpacity="0.15"/>}
      {/* Dots */}
      {showDots && pts.map((pt, i) => (
        <g key={i}>
          <circle cx={pt.x} cy={pt.y} r="4" fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }}/>
          <circle cx={pt.x} cy={pt.y} r="2" fill="white"/>
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GLASSMORPHISM CARD
═══════════════════════════════════════════════════════════════ */
function Card({ children, style = {}, glow = false, hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={hover ? "card-hover" : ""}
      style={{
        background: T.glass,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${glow ? T.borderGreen : T.glassBorder}`,
        borderRadius: 16,
        padding: 24,
        boxShadow: glow ? `0 0 24px ${T.greenGlow}, inset 0 1px 0 rgba(255,255,255,0.06)` : "inset 0 1px 0 rgba(255,255,255,0.04)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BUTTON
═══════════════════════════════════════════════════════════════ */
function Btn({ children, onClick, variant = "primary", style = {}, disabled = false, icon }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    minHeight: 48, padding: "0 24px", borderRadius: 99,
    border: "none", fontFamily: font, fontWeight: 700, fontSize: 15,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
    letterSpacing: 0.3, whiteSpace: "nowrap",
  };
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${T.green}, ${T.greenDeep})`,
      color: "#fff",
      boxShadow: `0 4px 20px ${T.greenGlow}`,
    },
    secondary: {
      background: "transparent",
      color: T.green,
      border: `1.5px solid ${T.green}`,
    },
    ghost: {
      background: T.grayD,
      color: T.gray,
      border: `1px solid rgba(255,255,255,0.08)`,
    },
    danger: {
      background: `linear-gradient(135deg, ${T.red}, #B71C1C)`,
      color: "#fff",
    },
  };
  return (
    <button className="btn-press" style={{ ...base, ...variants[variant], ...style }} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={18} color="currentColor"/>}
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTRIBUTION CALENDAR
═══════════════════════════════════════════════════════════════ */
function HeatMap({ weeks = 12 }) {
  const cells = Array.from({ length: weeks * 7 }, () => {
    const r = Math.random();
    return r > 0.35 ? (r > 0.75 ? 2 : 1) : 0;
  });
  const colors = [T.grayD, `${T.greenDeep}99`, T.green];
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Array.from({ length: 7 }).map((_, d) => (
            <div key={d} style={{
              width: 12, height: 12, borderRadius: 3,
              background: colors[cells[w * 7 + d]],
              boxShadow: cells[w*7+d] === 2 ? `0 0 4px ${T.green}60` : "none",
            }}/>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   POSE CANVAS (skeleton overlay)
═══════════════════════════════════════════════════════════════ */
function PoseCanvas({ kneeAngle }) {
  const ref = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const lift = (kneeAngle / 130) * H * 0.10;

      const joints = {
        head:    { x: W*.5,  y: H*.11 },
        neck:    { x: W*.5,  y: H*.22 },
        sL:      { x: W*.36, y: H*.30 },
        sR:      { x: W*.64, y: H*.30 },
        hipL:    { x: W*.39, y: H*.50 },
        hipR:    { x: W*.61, y: H*.50 },
        kneeL:   { x: W*.37, y: H*.66 - lift },
        kneeR:   { x: W*.63, y: H*.66 - lift },
        ankleL:  { x: W*.35, y: H*.84 },
        ankleR:  { x: W*.65, y: H*.84 },
      };

      const bone = (a, b, alpha = 0.6) => {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        const grd = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grd.addColorStop(0, `rgba(0,200,83,${alpha})`);
        grd.addColorStop(1, `rgba(0,168,70,${alpha})`);
        ctx.strokeStyle = grd; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.stroke();
      };

      const pairs = [["head","neck"],["neck","sL"],["neck","sR"],["sL","hipL"],["sR","hipR"],
        ["hipL","hipR"],["hipL","kneeL"],["hipR","kneeR"],["kneeL","ankleL"],["kneeR","ankleR"]];
      pairs.forEach(([a, b]) => bone(joints[a], joints[b]));

      const dot = (j, color, r = 6, isKnee = false) => {
        if (isKnee) {
          ctx.beginPath(); ctx.arc(j.x, j.y, r+6, 0, Math.PI*2);
          ctx.fillStyle = "rgba(255,149,0,0.18)"; ctx.fill();
        }
        const grd = ctx.createRadialGradient(j.x, j.y, 0, j.x, j.y, r+4);
        grd.addColorStop(0, `${color}60`); grd.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(j.x, j.y, r+4, 0, Math.PI*2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(j.x, j.y, r, 0, Math.PI*2);
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.5; ctx.stroke();
      };

      Object.entries(joints).forEach(([k, j]) => {
        const isKnee = k === "kneeL" || k === "kneeR";
        dot(j, isKnee ? "#FF9500" : T.green, isKnee ? 8 : 6, isKnee);
      });

      // Angle arc at left knee
      const kL = joints.kneeL, hip = joints.hipL, ank = joints.ankleL;
      const a1 = Math.atan2(hip.y - kL.y, hip.x - kL.x);
      const a2 = Math.atan2(ank.y - kL.y, ank.x - kL.x);
      ctx.beginPath(); ctx.arc(kL.x, kL.y, 24, a1, a2);
      ctx.strokeStyle = "rgba(255,149,0,0.7)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#FF9500"; ctx.font = "bold 11px Inter,sans-serif";
      ctx.fillText(`${kneeAngle}°`, kL.x + 16, kL.y - 12);

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [kneeAngle]);

  return (
    <canvas ref={ref} width={420} height={360}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}/>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WEBCAM FEED
═══════════════════════════════════════════════════════════════ */
function WebcamFeed({ kneeAngle }) {
  const vidRef = useRef(null);
  const [active, setActive] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let stream;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => { stream = s; if (vidRef.current) { vidRef.current.srcObject = s; } setActive(true); })
      .catch(() => setErr(true));
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  return (
    <div style={{
      position: "relative", width: "100%", height: 360,
      borderRadius: 20, overflow: "hidden",
      border: `1.5px solid ${T.borderGreen}`,
      boxShadow: `0 0 32px ${T.greenGlow}, 0 0 0 1px rgba(0,200,83,0.15)`,
      background: T.surface,
    }}>
      {active
        ? <video ref={vidRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}/>
        : <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 16, background: T.grayD }}>
              <Icon name="camera" size={32} color={T.gray}/>
            </div>
            <div style={{ color: T.gray, fontSize: 13, textAlign: "center" }}>
              {err ? "Camera access denied\nRunning in simulation mode" : "Activating camera…"}
            </div>
          </div>
      }
      <PoseCanvas kneeAngle={kneeAngle}/>
      {/* LIVE badge */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        display: "flex", alignItems: "center", gap: 6,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
        border: `1px solid ${T.borderGreen}`,
        borderRadius: 99, padding: "5px 12px",
      }}>
        <div className="live-badge" style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }}/>
        <span style={{ color: T.white, fontSize: 11, fontWeight: 800, letterSpacing: 1.5 }}>LIVE</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   METRIC HOOK
═══════════════════════════════════════════════════════════════ */
function useMetrics(phase) {
  const [m, setM] = useState({ knee: 20, hip: 15, sym: 82, reps: 0, t: 0 });
  const state = useRef({ t: 0, phase: "down", count: 0, start: Date.now() });

  useEffect(() => {
    const id = setInterval(() => {
      state.current.t += 0.038;
      const tt = state.current.t;
      const maxK = phase === 2 ? 118 : 98;
      const knee = Math.round(18 + ((Math.sin(tt) + 1) / 2) * (maxK - 18));
      const hip  = Math.round(10 + ((Math.sin(tt + 0.3) + 1) / 2) * 68);
      const sym  = Math.round(83 + Math.sin(tt * 1.8) * 7);
      const elapsed = Math.floor((Date.now() - state.current.start) / 1000);
      if (knee > maxK * 0.78 && state.current.phase === "down") state.current.phase = "up";
      else if (knee < 28 && state.current.phase === "up") { state.current.phase = "down"; state.current.count = Math.min(state.current.count + 1, 15); }
      setM({ knee, hip, sym, reps: state.current.count, t: elapsed });
    }, 80);
    return () => clearInterval(id);
  }, [phase]);
  return m;
}

/* ═══════════════════════════════════════════════════════════════
   HEADER HERO
═══════════════════════════════════════════════════════════════ */
function Hero({ title, subtitle, right, style = {} }) {
  return (
    <div style={{
      background: `linear-gradient(180deg, #0D2818 0%, ${T.bg} 100%)`,
      padding: "24px 20px 20px",
      position: "relative", overflow: "hidden",
      ...style,
    }}>
      {/* Glow orb */}
      <div style={{
        position: "absolute", top: -30, right: -30, width: 180, height: 180,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,83,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: T.white, lineHeight: 1.15, letterSpacing: -0.5, margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ color: T.gray, fontSize: 13, marginTop: 4, fontWeight: 400 }}>{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 1: PATIENT LOGIN
═══════════════════════════════════════════════════════════════ */
function PatientLogin({ onBegin }) {
  const [name, setName] = useState("Alex Johnson");
  const [phase, setPhase] = useState(1);

  return (
    <div className="fadeUp" style={{
      minHeight: "100vh", background: T.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Background glow orbs */}
      <div style={{ position: "absolute", top: "15%", right: "-20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,83,0.12) 0%, transparent 70%)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: "10%", left: "-15%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(27,94,32,0.15) 0%, transparent 70%)", pointerEvents: "none" }}/>

      {/* Logo + brand */}
      <div className="fadeUp" style={{ textAlign: "center", marginBottom: 48 }}>
        <ValorLogo size={72}/>
        <h1 style={{ color: T.white, fontSize: 38, fontWeight: 900, margin: "16px 0 6px", letterSpacing: -1.5, fontFamily: font }}>ValorPT</h1>
        <p style={{ color: T.gray, fontSize: 14, letterSpacing: 0.5, textTransform: "uppercase" }}>Clinical AI Motion Analysis</p>
      </div>

      <Card className="fadeUp2" style={{ width: "100%", maxWidth: 400, padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: T.gray, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 10 }}>Patient Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
            style={{
              width: "100%", background: T.surface2, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: "14px 16px", color: T.white, fontSize: 15,
              fontFamily: font, transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = T.borderGreen}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ color: T.gray, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 10 }}>Rehab Phase</label>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { p: 1, label: "Phase 1", sub: "Weeks 1–3" },
              { p: 2, label: "Phase 2", sub: "Weeks 4–6" },
            ].map(({ p, label, sub }) => (
              <div key={p} onClick={() => setPhase(p)} style={{
                flex: 1, padding: "16px 12px", textAlign: "center", borderRadius: 12,
                border: `1.5px solid ${phase === p ? T.green : T.border}`,
                background: phase === p ? T.greenDim : "transparent",
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: phase === p ? `0 0 16px ${T.greenGlow}` : "none",
              }}>
                <div style={{ color: phase === p ? T.green : T.gray, fontWeight: 800, fontSize: 14 }}>{label}</div>
                <div style={{ color: T.gray, fontSize: 11, marginTop: 3 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        <Btn onClick={() => name && onBegin({ name, phase })} style={{ width: "100%", fontSize: 16 }} icon="arrow">
          Begin Session
        </Btn>
      </Card>

      <p style={{ color: T.grayD, fontSize: 12, marginTop: 28, letterSpacing: 0.3 }}>ValorPT v2.1 · HIPAA Compliant · SOC 2 Type II</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 2: PROGRAM DASHBOARD
═══════════════════════════════════════════════════════════════ */
function ProgramDashboard({ patient, onStartSession }) {
  const exercises = patient.phase === 1 ? PHASE1_EXERCISES : PHASE2_EXERCISES;
  const done = exercises.filter(e => e.done).length;
  const pct = Math.round((done / exercises.length) * 100);

  return (
    <div className="fadeUp" style={{ minHeight: "100vh", background: T.bg, color: T.white, paddingBottom: 88 }}>
      <Hero
        title="ACL Rehab Program"
        subtitle={`${patient.name} · Week ${patient.week} of 6`}
        right={
          <ProgressRing value={patient.week} max={6} size={68} strokeWidth={5}
            label={`W${patient.week}`} sublabel="of 6" color={T.green}/>
        }
      />

      {/* Overall progress strip */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
          <span style={{ color: T.gray, fontSize: 12, fontWeight: 600 }}>Today's Progress</span>
          <span style={{ color: T.green, fontSize: 13, fontWeight: 800 }}>{done}/{exercises.length} exercises</span>
        </div>
        <div style={{ height: 6, background: T.grayD, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${T.greenDeep}, ${T.green})`, borderRadius: 99, boxShadow: `0 0 12px ${T.green}80`, transition: "width 1s cubic-bezier(0.16,1,0.3,1)" }}/>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ color: T.gray, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
          Phase {patient.phase} — {patient.phase === 1 ? "ROM & Quad Activation" : "Strength & Functional Control"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {exercises.map((ex, i) => (
            <div key={ex.id} className="card-hover" onClick={() => onStartSession(ex)}
              style={{
                background: ex.done ? "rgba(0,200,83,0.06)" : T.glass,
                backdropFilter: "blur(20px)",
                border: `1px solid ${ex.done ? T.borderGreen : T.glassBorder}`,
                borderRadius: 14, padding: "16px 18px",
                display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                transition: "all 0.25s",
              }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: ex.done ? T.greenDim : T.grayD,
                border: `1.5px solid ${ex.done ? T.green : T.border}`,
                boxShadow: ex.done ? `0 0 10px ${T.greenGlow}` : "none",
              }}>
                {ex.done
                  ? <Icon name="check" size={16} color={T.green}/>
                  : <span style={{ color: T.gray, fontSize: 13, fontWeight: 800 }}>{i + 1}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.white }}>{ex.name}</div>
                <div style={{ color: T.gray, fontSize: 12, marginTop: 2 }}>{ex.sets} · {ex.metric}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                {!ex.done && <span style={{ fontSize: 11, color: T.green, fontWeight: 700, background: T.greenDim, padding: "3px 10px", borderRadius: 99 }}>Next</span>}
                <Icon name="chevron" size={16} color={T.gray}/>
              </div>
            </div>
          ))}
        </div>

        <Btn onClick={() => onStartSession(exercises.find(e => !e.done) || exercises[0])}
          style={{ width: "100%", marginTop: 24, fontSize: 16 }} icon="play">
          Start Today's Session
        </Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 3: EXERCISE SESSION
═══════════════════════════════════════════════════════════════ */
function ExerciseSession({ patient, exercise, onComplete, onBack }) {
  const m = useMetrics(patient.phase);
  const [sets, setSets] = useState(0);
  const totalSets = 3;
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const INSTRS = {
    "Lying Heel Slides": "Lie flat. Slide heel toward buttocks, bending knee as far as comfortable. Hold 2s, return slowly. Keep lower back flat.",
    "Seated Heel Slides": "Sit in chair. Slide heel under chair bending knee maximally. Hold 2s. Return slowly. Aim for increased range each rep.",
    "Straight Leg Raises": "Tighten quad, raise leg 45°. Hold 2s. Lower slowly with control. Keep opposite knee bent for support.",
    "Long Arc Quad": "Sit at edge of surface. Fully straighten leg, hold 5s, lower slowly. Focus on terminal extension.",
    "Single Leg Squat 50%": "Stand on operative leg. Lower to ~50% depth, knee over 2nd toe. Control descent and ascent equally.",
    "Single Leg Squat Max": "Stand on operative leg. Lower as deep as comfortable. Maintain trunk upright and knee alignment.",
    "Step-Ups": "Step up onto surface leading with operative leg. Straighten fully at top. Step down with control.",
    "Forward Lunges": "Step forward, lower back knee toward floor. Keep front knee over foot. Drive back up through heel.",
  };
  const instr = INSTRS[exercise?.name] || "Perform movement slowly and with control. Maintain proper alignment throughout the exercise.";

  const metricCards = [
    { label: "Knee Flexion", val: m.knee, unit: "°", color: T.orange, icon: "bone" },
    { label: "Hip Flexion",  val: m.hip,  unit: "°", color: T.green,  icon: "activity" },
    { label: "Symmetry",     val: m.sym,  unit: "%", color: m.sym >= 80 ? T.green : T.red, icon: "target" },
    { label: "Reps",         val: m.reps, unit: "",  color: T.white,  icon: "zap" },
  ];

  return (
    <div className="fadeUp" style={{ minHeight: "100vh", background: T.bg, color: T.white, paddingBottom: 88 }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, #0D2818 0%, ${T.bg} 100%)`,
        padding: "14px 20px", display: "flex", alignItems: "center", gap: 12,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,83,0.18) 0%, transparent 70%)", pointerEvents: "none" }}/>
        <button onClick={onBack} className="btn-press" style={{ background: T.grayD, border: `1px solid ${T.border}`, borderRadius: 99, padding: "8px 12px", color: T.gray, cursor: "pointer", display: "flex" }}>
          <Icon name="back" size={18} color={T.gray}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>{exercise?.name}</div>
          <div style={{ color: T.green, fontSize: 12, marginTop: 1 }}>Phase {patient.phase} · Set {sets + 1} of {totalSets}</div>
        </div>
        <div style={{ background: T.grayD, border: `1px solid ${T.border}`, borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
          <div style={{ color: T.green, fontWeight: 900, fontSize: 18, fontVariantNumeric: "tabular-nums" }}>{fmt(m.t)}</div>
          <div style={{ color: T.gray, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }}>Timer</div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Webcam */}
        <WebcamFeed kneeAngle={m.knee}/>

        {/* Metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {metricCards.map(mc => (
            <Card key={mc.label} style={{ padding: "16px 18px", textAlign: "center", gap: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
                <Icon name={mc.icon} size={14} color={T.gray}/>
                <span style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>{mc.label}</span>
              </div>
              <div style={{ color: mc.color, fontSize: 40, fontWeight: 900, fontVariantNumeric: "tabular-nums", lineHeight: 1, letterSpacing: -1 }}>
                <AnimNum value={mc.val} suffix={mc.unit}/>
              </div>
            </Card>
          ))}
        </div>

        {/* Set indicators */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {Array.from({ length: totalSets }).map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: "50%",
              background: i < sets ? T.green : i === sets ? T.green : T.grayD,
              opacity: i < sets ? 1 : i === sets ? 1 : 0.4,
              boxShadow: i <= sets ? `0 0 6px ${T.green}` : "none",
            }}/>
          ))}
        </div>

        {/* Instruction */}
        <Card style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Icon name="info" size={18} color={T.green} style={{ flexShrink: 0, marginTop: 1 }}/>
            <p style={{ color: T.gray, fontSize: 13, lineHeight: 1.6 }}>{instr}</p>
          </div>
        </Card>

        <Btn
          onClick={() => { if (sets < totalSets - 1) setSets(s => s + 1); else onComplete({ m, exercise }); }}
          style={{ width: "100%", fontSize: 16 }}
          icon={sets < totalSets - 1 ? "check" : "arrow"}
        >
          {sets < totalSets - 1 ? `Complete Set ${sets + 1}` : "Finish Exercise"}
        </Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 4: SESSION RESULTS
═══════════════════════════════════════════════════════════════ */
function SessionResults({ result, onNext, onEnd }) {
  const repData = [22, 44, 72, 90, 100, 107, 104, 102, 108, 106, 104, 108, 107, 108, 108];

  const W = 340, H = 100;
  const pad = { t: 8, b: 16, l: 24, r: 8 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const mn = 0, mx = 130;
  const pts = repData.map((v, i) => ({
    x: pad.l + (i / (repData.length - 1)) * cw,
    y: pad.t + ch - ((v - mn) / (mx - mn)) * ch,
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const c1x = (pts[i-1].x + pts[i].x) / 2;
    d += ` C ${c1x} ${pts[i-1].y}, ${c1x} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
  }
  const area = `${d} L ${pts[pts.length-1].x} ${pad.t+ch} L ${pts[0].x} ${pad.t+ch} Z`;

  return (
    <div className="fadeUp" style={{ minHeight: "100vh", background: T.bg, color: T.white, paddingBottom: 88 }}>
      {/* Banner */}
      <div style={{
        background: `linear-gradient(135deg, #0D2818, ${T.greenDeep}90, #0A0A0A)`,
        padding: "40px 24px 32px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,83,0.15) 0%, transparent 65%)", pointerEvents: "none" }}/>
        <div style={{ fontSize: 56, lineHeight: 1 }}>🎯</div>
        <h2 style={{ margin: "14px 0 6px", fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>Exercise Complete!</h2>
        <p style={{ color: T.gray, fontSize: 14 }}>{result?.exercise?.name}</p>
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* KPI grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Peak Flexion", val: "108°", trend: "↑ 6°", trendColor: T.green },
            { label: "Avg Symmetry", val: "87%",  trend: "↑ 3%", trendColor: T.green },
            { label: "Reps Done",    val: "15",    trend: "✓ Target", trendColor: T.green },
          ].map(k => (
            <Card key={k.label} style={{ padding: "16px 12px", textAlign: "center" }}>
              <div style={{ color: T.gray, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{k.label}</div>
              <div style={{ color: T.green, fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{k.val}</div>
              <div style={{ color: k.trendColor, fontSize: 10, marginTop: 5, fontWeight: 600 }}>{k.trend}</div>
            </Card>
          ))}
        </div>

        {/* Rep chart */}
        <Card>
          <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12, fontWeight: 600 }}>Knee Flexion by Rep</div>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
            <defs>
              <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.green} stopOpacity="0.35"/>
                <stop offset="100%" stopColor={T.green} stopOpacity="0.01"/>
              </linearGradient>
            </defs>
            <path d={area} fill="url(#repGrad)"/>
            <path d={d} fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${T.green}60)` }}/>
          </svg>
        </Card>

        {/* Comparison */}
        <Card glow>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ fontSize: 32 }}>📈</div>
            <div>
              <div style={{ fontWeight: 800, color: T.green, fontSize: 15 }}>Great progress!</div>
              <div style={{ color: T.gray, fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>Peak flexion improved 6° vs your last session. You're on track to reach 120° by Week 6.</div>
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={onNext} style={{ flex: 2 }} icon="arrow">Next Exercise</Btn>
          <Btn onClick={onEnd} variant="secondary" style={{ flex: 1 }}>End Session</Btn>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 5: PROGRESS DASHBOARD
═══════════════════════════════════════════════════════════════ */
function ProgressDashboard({ patient }) {
  const sessions = [
    { date: "Apr 14", exercises: 5, peak: 82 },
    { date: "Apr 16", exercises: 6, peak: 87 },
    { date: "Apr 18", exercises: 5, peak: 94 },
    { date: "Apr 20", exercises: 6, peak: 102 },
  ];

  const badges = [
    { icon: "🏆", label: "First Session",    earned: true },
    { icon: "📐", label: "Reached 90° ROM",  earned: true },
    { icon: "📅", label: "Week 2 Complete",  earned: true },
    { icon: "🔥", label: "5-Day Streak",     earned: false },
    { icon: "⚡", label: "Phase 2 Ready",    earned: false },
  ];

  return (
    <div className="fadeUp" style={{ minHeight: "100vh", background: T.bg, color: T.white, paddingBottom: 88 }}>
      <Hero
        title={patient.name}
        subtitle={`Week ${patient.week} of 6 · Phase ${patient.phase} ACL Rehab`}
        right={
          <div style={{ textAlign: "center" }}>
            <div style={{ background: T.greenDim, border: `1px solid ${T.borderGreen}`, borderRadius: 14, padding: "10px 16px" }}>
              <div style={{ color: T.green, fontWeight: 900, fontSize: 24, lineHeight: 1 }}>4</div>
              <div style={{ color: T.gray, fontSize: 10, marginTop: 2 }}>day streak 🔥</div>
            </div>
          </div>
        }
      />

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Ring trio */}
        <Card>
          <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 20, fontWeight: 600 }}>Key Metrics</div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <ProgressRing value={108} max={130} size={90} label="108°" sublabel="ROM" color={T.green}/>
            <ProgressRing value={91}  max={100} size={90} label="91%"  sublabel="Symmetry" color={T.orange}/>
            <ProgressRing value={3}   max={6}   size={90} label="W3"   sublabel="Progress" color="#00B8FF"/>
          </div>
        </Card>

        {/* ROM chart */}
        <Card>
          <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4, fontWeight: 600 }}>Knee Flexion ROM</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ color: T.white, fontSize: 28, fontWeight: 900 }}>108°</span>
            <span style={{ color: T.green, fontSize: 13, fontWeight: 700 }}>↑ 43° since surgery</span>
          </div>
          <Chart data={ROM_DATA} label="rom" minVal={55} maxVal={125} height={120}/>
        </Card>

        {/* Symmetry chart */}
        <Card>
          <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4, fontWeight: 600 }}>Symmetry Score</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ color: T.white, fontSize: 28, fontWeight: 900 }}>91%</span>
            <span style={{ color: T.orange, fontSize: 13, fontWeight: 700 }}>↑ 18% since start</span>
          </div>
          <Chart data={SYM_DATA} label="sym" minVal={65} maxVal={100} height={100} color={T.orange}/>
        </Card>

        {/* Badges */}
        <Card>
          <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16, fontWeight: 600 }}>Milestones</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {badges.map(b => (
              <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: b.earned ? 1 : 0.3, minWidth: 60 }}>
                <div style={{ fontSize: 30, filter: b.earned ? `drop-shadow(0 0 8px ${T.green}80)` : "grayscale(1)" }}>{b.icon}</div>
                <span style={{ color: b.earned ? T.greenPale : T.gray, fontSize: 10, textAlign: "center", lineHeight: 1.3, fontWeight: 600 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent sessions */}
        <Card>
          <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16, fontWeight: 600 }}>Recent Sessions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {sessions.map((s, i) => (
              <div key={s.date} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < sessions.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.greenDim, border: `1px solid ${T.borderGreen}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="calendar" size={16} color={T.green}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{s.date}</div>
                  <div style={{ color: T.gray, fontSize: 12, marginTop: 1 }}>{s.exercises} exercises completed</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: T.green, fontWeight: 900, fontSize: 18 }}>{s.peak}°</div>
                  <div style={{ color: T.gray, fontSize: 10 }}>peak ROM</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CLINICIAN: DASHBOARD
═══════════════════════════════════════════════════════════════ */
function ClinicianDashboard({ onSelectPatient }) {
  const [search, setSearch] = useState("");
  const filtered = CLINICIAN_PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fadeUp" style={{ minHeight: "100vh", background: T.bg, color: T.white }}>
      <Hero
        title="Patient Overview"
        subtitle={`${CLINICIAN_PATIENTS.length} active patients · ${CLINICIAN_PATIENTS.filter(p => p.flagged).length} flagged`}
        right={<Btn variant="secondary" style={{ padding: "10px 16px", fontSize: 13 }} icon="plus">Add</Btn>}
      />

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: "16px 20px 0" }}>
        {[
          { label: "Patients",   val: 4,    color: T.green,  sub: "active" },
          { label: "Compliance", val: "78%", color: T.orange, sub: "avg" },
          { label: "Flagged",    val: 2,    color: T.red,    sub: "review" },
        ].map(k => (
          <Card key={k.label} style={{ padding: "16px 12px", textAlign: "center" }}>
            <div style={{ color: k.color, fontSize: 30, fontWeight: 900 }}>{k.val}</div>
            <div style={{ color: T.gray, fontSize: 11, marginTop: 2 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={16} color={T.gray}/>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients…"
            style={{
              width: "100%", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 12,
              padding: "12px 14px 12px 40px", color: T.white, fontSize: 14, fontFamily: font,
            }}/>
        </div>

        {/* Patient list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(p => (
            <div key={p.id} className="card-hover" onClick={() => onSelectPatient(p)}
              style={{
                background: T.glass, backdropFilter: "blur(20px)",
                border: `1px solid ${p.flagged ? "rgba(255,59,48,0.3)" : T.glassBorder}`,
                borderRadius: 16, padding: "18px", cursor: "pointer",
                boxShadow: p.flagged ? "0 0 20px rgba(255,59,48,0.08)" : "none",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${T.greenDeep}, ${T.green})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 17, color: T.white,
                  boxShadow: `0 0 14px ${T.greenGlow}`,
                }}>
                  {p.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>{p.name}</span>
                    {p.flagged && <span title="Needs review"><Icon name="flag" size={14} color={T.red}/></span>}
                  </div>
                  <div style={{ color: T.gray, fontSize: 12, marginTop: 2 }}>Phase {p.phase} · Week {p.week} · Last: {p.lastSession}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ color: p.compliance >= 80 ? T.green : p.compliance >= 65 ? T.orange : T.red, fontWeight: 900, fontSize: 20 }}>{p.compliance}%</div>
                  <div style={{ color: T.gray, fontSize: 10 }}>compliance</div>
                </div>
              </div>
              <div style={{ marginTop: 12, height: 4, background: T.grayD, borderRadius: 99 }}>
                <div style={{
                  height: "100%", borderRadius: 99, transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
                  width: `${p.compliance}%`,
                  background: p.compliance >= 80 ? `linear-gradient(90deg, ${T.greenDeep}, ${T.green})` : p.compliance >= 65 ? `linear-gradient(90deg, #E65100, ${T.orange})` : `linear-gradient(90deg, #B71C1C, ${T.red})`,
                  boxShadow: `0 0 8px ${p.compliance >= 80 ? T.green : p.compliance >= 65 ? T.orange : T.red}60`,
                }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CLINICIAN: PATIENT VIEW
═══════════════════════════════════════════════════════════════ */
function ClinicianPatientView({ patient, onBack }) {
  const alerts = patient.flagged
    ? ["Knee flexion plateaued for 5 consecutive days", "Missed 2 consecutive sessions this week"]
    : [];

  const breakdown = [
    { name: "Lying Heel Slides",  done: 9,  total: 12, metric: "88°",  status: "good" },
    { name: "Seated Heel Slides", done: 11, total: 12, metric: "82°",  status: "good" },
    { name: "Straight Leg Raises",done: 10, total: 12, metric: "84%",  status: "good" },
    { name: "Long Arc Quad",      done: 8,  total: 12, metric: "79°",  status: "warn" },
  ];

  const wk = patient.week;

  return (
    <div className="fadeUp" style={{ minHeight: "100vh", background: T.bg, color: T.white, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(180deg, #0D2818 0%, ${T.bg} 100%)`,
        padding: "14px 20px", display: "flex", alignItems: "center", gap: 14,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,83,0.18) 0%, transparent 70%)", pointerEvents: "none" }}/>
        <button onClick={onBack} className="btn-press" style={{ background: T.grayD, border: `1px solid ${T.border}`, borderRadius: 99, padding: "8px 12px", cursor: "pointer", display: "flex" }}>
          <Icon name="back" size={18} color={T.gray}/>
        </button>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Patient Report</span>
      </div>

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Patient card */}
        <Card>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.greenDeep}, ${T.green})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 24, color: T.white,
              boxShadow: `0 0 20px ${T.greenGlow}`,
            }}>
              {patient.name.split(" ").map(w => w[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 900, fontSize: 20 }}>{patient.name}</span>
                {patient.flagged && <Icon name="flag" size={16} color={T.red}/>}
              </div>
              <div style={{ color: T.green, fontSize: 13, fontWeight: 600 }}>Phase {patient.phase} · Week {patient.week}</div>
              <div style={{ color: T.gray, fontSize: 12, marginTop: 2 }}>Surgery: 2026-04-01</div>
            </div>
            <ProgressRing value={patient.compliance} max={100} size={72} label={`${patient.compliance}%`} sublabel="comply" color={patient.compliance >= 80 ? T.green : T.orange}/>
          </div>
        </Card>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card style={{ border: `1px solid rgba(255,59,48,0.4)`, background: "rgba(255,59,48,0.06)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <Icon name="alert" size={18} color={T.red}/>
              <span style={{ color: T.red, fontWeight: 800, fontSize: 14 }}>Clinical Alerts</span>
            </div>
            {alerts.map((a, i) => (
              <div key={i} style={{ color: "#FFCDD2", fontSize: 13, padding: "8px 0", borderTop: i > 0 ? `1px solid rgba(255,59,48,0.15)` : "none", lineHeight: 1.5 }}>• {a}</div>
            ))}
          </Card>
        )}

        {/* ROM Chart */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>Knee Flexion ROM</div>
              <div style={{ color: T.white, fontSize: 26, fontWeight: 900, marginTop: 4 }}>
                {ROM_DATA[Math.min(wk * 2 - 1, ROM_DATA.length - 1)]}°
              </div>
            </div>
            <span style={{ color: T.green, fontSize: 12, fontWeight: 700, background: T.greenDim, padding: "4px 10px", borderRadius: 99 }}>↑ trending</span>
          </div>
          <Chart data={ROM_DATA.slice(0, Math.min(wk * 2, ROM_DATA.length))} label={`rom${patient.id}`} minVal={55} maxVal={125} height={120}/>
        </Card>

        {/* Symmetry chart */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>Symmetry Score</div>
              <div style={{ color: T.white, fontSize: 26, fontWeight: 900, marginTop: 4 }}>
                {SYM_DATA[Math.min(wk * 2 - 1, SYM_DATA.length - 1)]}%
              </div>
            </div>
            <span style={{ color: patient.flagged ? T.orange : T.green, fontSize: 12, fontWeight: 700, background: patient.flagged ? "rgba(255,149,0,0.12)" : T.greenDim, padding: "4px 10px", borderRadius: 99 }}>
              {patient.flagged ? "⚠ monitor" : "↑ trending"}
            </span>
          </div>
          <Chart data={SYM_DATA.slice(0, Math.min(wk * 2, SYM_DATA.length))} label={`sym${patient.id}`} minVal={65} maxVal={100} height={100} color={T.orange}/>
        </Card>

        {/* Compliance heatmap */}
        <Card>
          <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14, fontWeight: 600 }}>Session Compliance</div>
          <div style={{ overflowX: "auto", paddingBottom: 4 }}>
            <HeatMap weeks={12}/>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
            <span style={{ color: T.gray, fontSize: 10 }}>Less</span>
            {[T.grayD, `${T.greenDeep}99`, T.green].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }}/>
            ))}
            <span style={{ color: T.gray, fontSize: 10 }}>More</span>
          </div>
        </Card>

        {/* Exercise table */}
        <Card>
          <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14, fontWeight: 600 }}>Exercise Breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {breakdown.map((r, i) => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < breakdown.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.status === "good" ? T.green : T.orange, flexShrink: 0, boxShadow: `0 0 6px ${r.status === "good" ? T.green : T.orange}` }}/>
                <div style={{ flex: 1, fontSize: 13, color: T.white, fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: T.green, fontWeight: 700 }}>{r.done}</span>
                  <span style={{ color: T.gray }}>/{r.total}</span>
                </div>
                <div style={{ color: T.green, fontWeight: 800, fontSize: 14, minWidth: 38, textAlign: "right" }}>{r.metric}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOTTOM NAV (Patient)
═══════════════════════════════════════════════════════════════ */
function BottomNav({ active, onNav }) {
  const tabs = [
    { id: "home",     icon: "home",     label: "Home" },
    { id: "program",  icon: "program",  label: "Program" },
    { id: "record",   icon: "record",   label: "Record" },
    { id: "progress", icon: "chart",    label: "Progress" },
    { id: "profile",  icon: "person",   label: "Profile" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 480,
      background: "rgba(10,10,10,0.92)", backdropFilter: "blur(20px)",
      borderTop: `1px solid ${T.border}`,
      display: "flex", padding: "10px 0 12px",
      zIndex: 200,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNav(t.id)} style={{
          flex: 1, background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 0",
        }}>
          <div style={{
            padding: "6px 14px", borderRadius: 99,
            background: active === t.id ? T.greenDim : "transparent",
            boxShadow: active === t.id ? `0 0 12px ${T.greenGlow}` : "none",
            transition: "all 0.25s",
          }}>
            <Icon name={t.icon} size={20} color={active === t.id ? T.green : T.gray}/>
          </div>
          <span style={{ fontSize: 10, color: active === t.id ? T.green : T.gray, fontWeight: active === t.id ? 700 : 400, fontFamily: font }}>
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOP NAV (Clinician)
═══════════════════════════════════════════════════════════════ */
function TopNav({ active, onNav }) {
  const tabs = [
    { id: "patients",  icon: "patients",  label: "Patients" },
    { id: "analytics", icon: "analytics", label: "Analytics" },
    { id: "messages",  icon: "messages",  label: "Messages" },
    { id: "settings",  icon: "settings",  label: "Settings" },
  ];
  return (
    <div style={{
      background: "rgba(10,10,10,0.92)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", padding: "0 16px",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0", marginRight: 16 }}>
        <ValorLogo size={28}/>
        <span style={{ fontWeight: 900, fontSize: 14, color: T.white, letterSpacing: -0.3 }}>ValorPT</span>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNav(t.id)} style={{
            background: "none", border: "none", padding: "14px 12px",
            display: "flex", alignItems: "center", gap: 6,
            color: active === t.id ? T.green : T.gray,
            fontWeight: active === t.id ? 700 : 400,
            fontSize: 13, cursor: "pointer", fontFamily: font,
            borderBottom: active === t.id ? `2px solid ${T.green}` : "2px solid transparent",
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}>
            <Icon name={t.icon} size={14} color={active === t.id ? T.green : T.gray}/>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${T.greenDeep}, ${T.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: T.white }}>
        DR
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODE TOGGLE
═══════════════════════════════════════════════════════════════ */
function ModeToggle({ mode, setMode }) {
  return (
    <div style={{
      position: "fixed", top: 14, right: 14, zIndex: 300,
      display: "flex", background: "rgba(10,10,10,0.85)", backdropFilter: "blur(14px)",
      border: `1px solid ${T.border}`, borderRadius: 99, overflow: "hidden", padding: 3,
    }}>
      {[["patient", "🧑"], ["clinician", "🩺"]].map(([m, emoji]) => (
        <button key={m} onClick={() => setMode(m)} className="btn-press" style={{
          padding: "6px 13px", border: "none", cursor: "pointer", borderRadius: 99,
          background: mode === m ? `linear-gradient(135deg, ${T.greenDeep}, ${T.green})` : "transparent",
          color: mode === m ? T.white : T.gray,
          fontWeight: mode === m ? 700 : 400, fontSize: 12, fontFamily: font,
          transition: "all 0.25s", boxShadow: mode === m ? `0 0 12px ${T.greenGlow}` : "none",
        }}>
          {emoji} {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function ValorPT() {
  const [mode, setMode] = useState("patient");
  const [screen, setScreen] = useState("login");
  const [clinicScreen, setClinicScreen] = useState("dashboard");
  const [patient, setPatient] = useState(SAMPLE_PATIENT);
  const [exercise, setExercise] = useState(null);
  const [result, setResult] = useState(null);
  const [selPatient, setSelPatient] = useState(null);
  const [nav, setNav] = useState("home");
  const [clinicNav, setClinicNav] = useState("patients");

  const handleNav = (tab) => {
    setNav(tab);
    if (tab === "home" || tab === "program") setScreen("dashboard");
    if (tab === "record") setScreen("session");
    if (tab === "progress") setScreen("progress");
  };

  const renderPatient = () => {
    switch (screen) {
      case "login":    return <PatientLogin onBegin={p => { setPatient({ ...SAMPLE_PATIENT, ...p }); setScreen("dashboard"); }}/>;
      case "dashboard":return <ProgramDashboard patient={patient} onStartSession={ex => { setExercise(ex); setScreen("session"); }}/>;
      case "session":  return <ExerciseSession patient={patient} exercise={exercise} onComplete={r => { setResult(r); setScreen("results"); }} onBack={() => setScreen("dashboard")}/>;
      case "results":  return <SessionResults result={result} onNext={() => setScreen("dashboard")} onEnd={() => setScreen("dashboard")}/>;
      case "progress": return <ProgressDashboard patient={patient}/>;
      default: return null;
    }
  };

  const renderClinic = () => {
    switch (clinicScreen) {
      case "dashboard": return <ClinicianDashboard onSelectPatient={p => { setSelPatient(p); setClinicScreen("patient"); }}/>;
      case "patient":   return <ClinicianPatientView patient={selPatient} onBack={() => setClinicScreen("dashboard")}/>;
      default: return null;
    }
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{
        fontFamily: font, background: T.bg, minHeight: "100vh", color: T.white,
        maxWidth: 480, margin: "0 auto", position: "relative",
        boxShadow: "0 0 80px rgba(0,0,0,0.8)",
      }}>
        <ModeToggle mode={mode} setMode={setMode}/>

        {mode === "patient" ? (
          <>
            {renderPatient()}
            {screen !== "login" && <BottomNav active={nav} onNav={handleNav}/>}
          </>
        ) : (
          <>
            <TopNav active={clinicNav} onNav={tab => { setClinicNav(tab); if (tab === "patients") setClinicScreen("dashboard"); }}/>
            {renderClinic()}
          </>
        )}
      </div>
    </>
  );
}

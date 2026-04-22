import { useState } from "react";
import {
  ChevronLeft, Download, Share2, TrendingUp, TrendingDown,
  Calendar, Clock, FileText, Play, Award, Target, BarChart2, Check, X
} from "lucide-react";

const T = {
  bg: "#0A0A0A", surface: "#111111", surface2: "#161616",
  glass: "rgba(255,255,255,0.04)", glassBorder: "rgba(255,255,255,0.08)",
  green: "#00C853", greenDeep: "#1B5E20", greenDim: "rgba(0,200,83,0.12)",
  greenGlow: "rgba(0,200,83,0.25)", greenBorder: "rgba(0,200,83,0.3)",
  white: "#FFFFFF", gray: "#A0A0A0", grayD: "#2A2A2A",
  border: "rgba(255,255,255,0.08)", orange: "#FF9500", red: "#FF3B30",
};
const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

/* ── Sparkline ── */
function Sparkline({ data, color = T.green, width = 80, height = 32 }) {
  const mn = Math.min(...data), mx = Math.max(...data);
  const range = mx - mn || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - mn) / range) * (height - 4) - 2,
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  pts.slice(1).forEach(p => { d += ` L ${p.x} ${p.y}`; });
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}80)` }} />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color} />
    </svg>
  );
}

/* ── KPI Card ── */
function KPICard({ title, value, unit, trend, compare, color, sparkData, icon: Icon }) {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? T.green : T.red;
  return (
    <div style={{
      background: T.glass, backdropFilter: "blur(20px)",
      border: `1px solid ${color === T.orange ? "rgba(255,149,0,0.25)" : T.glassBorder}`,
      borderRadius: 16, padding: "16px 14px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ color: T.gray, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>{title}</span>
        {Icon && <Icon size={14} color={color} />}
      </div>
      <div style={{ color, fontWeight: 900, fontSize: 28, lineHeight: 1, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>
        {value}<span style={{ fontSize: 14, fontWeight: 600, marginLeft: 2 }}>{unit}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
        {isPositive ? <TrendingUp size={11} color={trendColor} /> : <TrendingDown size={11} color={trendColor} />}
        <span style={{ color: trendColor, fontSize: 11, fontWeight: 700 }}>
          {isPositive ? "+" : ""}{trend}{unit} vs last
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 }}>
        <span style={{ color: "#555", fontSize: 10 }}>{compare}</span>
        <Sparkline data={sparkData} color={color} />
      </div>
    </div>
  );
}

/* ── Recovery Trajectory Graph ── */
function TrajectoryGraph({ currentWeek = 3 }) {
  const W = 340, H = 180;
  const pad = { t: 20, b: 40, l: 44, r: 16 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const weeks = [0, 1, 2, 3, 4, 5, 6];
  const minFlex = 55, maxFlex = 135;
  const range = maxFlex - minFlex;

  const actual    = [65, 72, 82, 92, null, null, null];
  const expected  = [63, 70, 79, 88, 100, 112, 125];
  const threshold = [55, 60, 67, 74,  82,  90, 100];

  const px = (w) => pad.l + (w / 6) * cw;
  const py = (v) => pad.t + ch - ((v - minFlex) / range) * ch;

  const pathFor = (data) => {
    const pts = data.map((v, i) => v !== null ? { x: px(i), y: py(v) } : null).filter(Boolean);
    if (!pts.length) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  };

  // Area between expected and actual (weeks 0–3)
  const areaActual = actual.filter(v => v !== null);
  const areaExp = expected.slice(0, areaActual.length);
  const areaPath = areaActual.map((v, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(v)}`).join(" ") +
    " " + areaExp.map((v, i) => `L ${px(areaExp.length - 1 - i)} ${py(areaExp[areaExp.length - 1 - i])}`).join(" ") + " Z";

  const yLabels = [60, 75, 90, 105, 120];

  return (
    <div style={{ background: T.glass, backdropFilter: "blur(20px)", border: `1px solid ${T.glassBorder}`, borderRadius: 16, padding: "20px 16px" }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: T.white, marginBottom: 4 }}>ROM Recovery vs. Expected Trajectory</div>
      <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { color: T.green, dash: false, label: "Your progress" },
          { color: "rgba(255,255,255,0.6)", dash: true, label: "Expected curve" },
          { color: T.red, dash: true, label: "Min threshold" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={l.color} strokeWidth="2" strokeDasharray={l.dash ? "4 2" : "none"} /></svg>
            <span style={{ color: T.gray, fontSize: 10 }}>{l.label}</span>
          </div>
        ))}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="aheadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.green} stopOpacity="0.22" />
            <stop offset="100%" stopColor={T.green} stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {yLabels.map(v => (
          <g key={v}>
            <line x1={pad.l} y1={py(v)} x2={W - pad.r} y2={py(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={pad.l - 5} y={py(v) + 4} textAnchor="end" fill={T.gray} fontSize="9" fontFamily={font}>{v}°</text>
          </g>
        ))}
        {/* Week labels */}
        {weeks.map(w => (
          <text key={w} x={px(w)} y={H - 6} textAnchor="middle" fill={T.gray} fontSize="9" fontFamily={font}>W{w}</text>
        ))}
        {/* Shaded "ahead of schedule" area */}
        <path d={areaPath} fill="url(#aheadGrad)" />
        {/* Min threshold */}
        <path d={pathFor(threshold)} fill="none" stroke={T.red} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
        {/* Expected */}
        <path d={pathFor(expected)} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="5 3" />
        {/* Actual */}
        <path d={pathFor(actual)} fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${T.green}60)` }} />
        {actual.map((v, i) => v !== null && (
          <circle key={i} cx={px(i)} cy={py(v)} r="5" fill={T.green} stroke="rgba(0,0,0,0.6)" strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 4px ${T.green})` }} />
        ))}
        {/* Current week marker */}
        <line x1={px(currentWeek)} y1={pad.t} x2={px(currentWeek)} y2={pad.t + ch} stroke={T.green} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        <rect x={px(currentWeek) - 16} y={pad.t - 16} width={32} height={14} rx={4} fill={T.greenDim} stroke={T.greenBorder} strokeWidth={1} />
        <text x={px(currentWeek)} y={pad.t - 5} textAnchor="middle" fill={T.green} fontSize="8" fontWeight="700" fontFamily={font}>NOW</text>
      </svg>
    </div>
  );
}

/* ── Joint Heatmap ── */
function JointHeatmap() {
  const [hovered, setHovered] = useState(null);
  const joints = [
    { id: "r_shoulder", cx: 108, cy: 88,  angle: "92°",  status: "green",  label: "R. Shoulder" },
    { id: "l_shoulder", cx: 52,  cy: 88,  angle: "90°",  status: "green",  label: "L. Shoulder" },
    { id: "r_hip",      cx: 102, cy: 162, angle: "44°",  status: "green",  label: "R. Hip" },
    { id: "l_hip",      cx: 58,  cy: 162, angle: "41°",  status: "yellow", label: "L. Hip" },
    { id: "r_knee",     cx: 105, cy: 222, angle: "112°", status: "green",  label: "R. Knee" },
    { id: "l_knee",     cx: 55,  cy: 222, angle: "98°",  status: "yellow", label: "L. Knee" },
    { id: "r_ankle",    cx: 103, cy: 285, angle: "22°",  status: "green",  label: "R. Ankle" },
    { id: "l_ankle",    cx: 57,  cy: 285, angle: "20°",  status: "green",  label: "L. Ankle" },
  ];
  const statusColor = { green: T.green, yellow: T.orange, red: T.red };

  return (
    <div style={{ background: T.glass, backdropFilter: "blur(20px)", border: `1px solid ${T.glassBorder}`, borderRadius: 16, padding: "20px 16px" }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: T.white, marginBottom: 4 }}>Joint Analysis — Today's Session</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        {[{ color: T.green, label: "Normal" }, { color: T.orange, label: "Slight deviation" }, { color: T.red, label: "Significant" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
            <span style={{ color: T.gray, fontSize: 10 }}>{l.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="160" height="320" viewBox="0 0 160 320" fill="none">
            {/* Body outline */}
            <ellipse cx="80" cy="30" rx="18" ry="22" fill="#1A1A1A" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <rect x="68" y="50" width="14" height="12" rx="3" fill="#1A1A1A" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <path d="M47 62 L37 128 L57 130 L57 162 L103 162 L103 130 L123 128 L113 62 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
            <ellipse cx="40" cy="70" rx="12" ry="9" fill="#1A1A1A" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <ellipse cx="120" cy="70" rx="12" ry="9" fill="#1A1A1A" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <path d="M28 70 Q20 100 24 118 L32 118 Q36 100 36 78 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <path d="M132 70 Q140 100 136 118 L128 118 Q124 100 124 78 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <path d="M59 164 Q54 200 55 230 Q57 240 68 242 L68 290 Q66 298 66 308 L78 308 L78 164 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <path d="M101 164 Q106 200 105 230 Q103 240 92 242 L92 290 Q94 298 94 308 L82 308 L82 164 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <path d="M56 308 Q52 314 52 318 L80 318 L80 308 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d="M94 308 Q108 314 108 318 L80 318 L80 308 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {/* Joint circles */}
            {joints.map(j => {
              const c = statusColor[j.status];
              const isHov = hovered === j.id;
              return (
                <g key={j.id}
                  onMouseEnter={() => setHovered(j.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setHovered(hovered === j.id ? null : j.id)}
                  style={{ cursor: "pointer" }}>
                  <circle cx={j.cx} cy={j.cy} r={isHov ? 14 : 10} fill={`${c}22`} stroke={c} strokeWidth="2"
                    style={{ transition: "all 0.2s", filter: `drop-shadow(0 0 6px ${c}90)` }} />
                  <circle cx={j.cx} cy={j.cy} r={4} fill={c} />
                </g>
              );
            })}
          </svg>
        </div>
        {/* Legend / detail */}
        <div style={{ flex: 1 }}>
          {hovered ? (() => {
            const j = joints.find(x => x.id === hovered);
            const c = statusColor[j.status];
            return (
              <div style={{ background: `${c}15`, border: `1px solid ${c}40`, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ color: c, fontWeight: 800, fontSize: 14 }}>{j.label}</div>
                <div style={{ color: T.white, fontWeight: 900, fontSize: 28, marginTop: 4 }}>{j.angle}</div>
                <div style={{ color: T.gray, fontSize: 11, marginTop: 2 }}>
                  {j.status === "green" ? "Within normal range" : j.status === "yellow" ? "Slight deviation — monitor" : "Needs attention"}
                </div>
              </div>
            );
          })() : (
            <div style={{ color: T.gray, fontSize: 12, marginBottom: 10 }}>Tap a joint to see details</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {joints.map(j => {
              const c = statusColor[j.status];
              return (
                <div key={j.id}
                  onClick={() => setHovered(hovered === j.id ? null : j.id)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                    background: hovered === j.id ? `${c}12` : "transparent",
                    border: `1px solid ${hovered === j.id ? c + "40" : "transparent"}`,
                    transition: "all 0.2s",
                  }}>
                  <span style={{ color: T.white, fontSize: 12 }}>{j.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: c, fontWeight: 700, fontSize: 12 }}>{j.angle}</span>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: c, boxShadow: `0 0 4px ${c}` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN SESSION REPORT
══════════════════════════════════ */
/* ── Share Modal ── */
function ShareModal({ patient, onClose }) {
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 800,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        width: "100%", maxWidth: 480,
        background: "#111", borderRadius: "24px 24px 0 0",
        border: `1px solid rgba(255,255,255,0.1)`, borderBottom: "none",
        padding: "24px 20px 40px",
        animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <style>{`
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        `}</style>

        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 99, background: "#333", margin: "0 auto 20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: T.white }}>Share Report</div>
          <button onClick={onClose} style={{ background: T.grayD, border: `1px solid ${T.border}`, borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.gray }}>
            <X size={16} />
          </button>
        </div>

        {/* Report preview card */}
        <div style={{
          background: "linear-gradient(135deg, #0D2818, #111)",
          border: `1px solid ${T.greenBorder}`, borderRadius: 16, padding: "16px",
          marginBottom: 20, boxShadow: `0 0 24px ${T.greenGlow}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ color: T.green, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>ValorPT · Session Report</div>
              <div style={{ color: T.white, fontWeight: 900, fontSize: 18, marginTop: 4 }}>{patient?.name || "Alex Johnson"}</div>
              <div style={{ color: T.gray, fontSize: 12, marginTop: 2 }}>Apr 22, 2026 · Session 12</div>
            </div>
            <div style={{ background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
              <div style={{ color: T.green, fontWeight: 900, fontSize: 22, lineHeight: 1 }}>87</div>
              <div style={{ color: T.gray, fontSize: 9, textTransform: "uppercase", marginTop: 2 }}>Score</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[{ label: "Peak ROM", val: "112°" }, { label: "Symmetry", val: "91%" }, { label: "Reps", val: "15" }].map(s => (
              <div key={s.label} style={{ background: "rgba(0,200,83,0.08)", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                <div style={{ color: T.green, fontWeight: 900, fontSize: 16 }}>{s.val}</div>
                <div style={{ color: T.gray, fontSize: 9, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Send to PT button */}
        {sent ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 14,
            padding: "16px", color: T.green, fontWeight: 800, fontSize: 16,
          }}>
            <Check size={22} /> Sent to Dr. Paternite!
          </div>
        ) : (
          <button onClick={handleSend} style={{
            width: "100%", background: `linear-gradient(135deg, ${T.green}, ${T.greenDeep})`,
            border: "none", borderRadius: 14, padding: "16px 0", cursor: "pointer",
            fontFamily: font, fontWeight: 800, fontSize: 16, color: "#fff",
            boxShadow: `0 4px 20px ${T.greenGlow}`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <Share2 size={20} /> Send to Dr. Paternite
          </button>
        )}
      </div>
    </div>
  );
}

export default function SessionReport({ patient, exercise, onBack, onViewProgress }) {
  const [showShare, setShowShare] = useState(false);
  const patientName = patient?.name?.split(" ")[0] || "Alex";

  const repData = [
    { rep: 1, knee: 108, hip: 42, sym: 94, form: 91 },
    { rep: 2, knee: 112, hip: 44, sym: 89, form: 85 },
    { rep: 3, knee: 110, hip: 43, sym: 92, form: 88 },
  ];

  const kpis = [
    { title: "Peak Knee Flexion", value: 112, unit: "°", trend: 7, compare: "Personal best", color: T.green, sparkData: [82, 87, 94, 99, 104, 108, 112], icon: TrendingUp },
    { title: "Symmetry Score", value: 91, unit: "%", trend: 3, compare: "Above target", color: T.green, sparkData: [75, 79, 82, 85, 87, 89, 91], icon: Target },
    { title: "Form Consistency", value: 88, unit: "%", trend: -2, compare: "Rep 2 slight dip", color: T.orange, sparkData: [88, 90, 91, 89, 87, 90, 88], icon: Award },
    { title: "Sessions This Week", value: "3/4", unit: "", trend: 0, compare: "On track", color: T.green, sparkData: [1, 1, 2, 2, 3, 3, 3], icon: Calendar },
  ];

  return (
    <>
    {showShare && <ShareModal patient={patient} onClose={() => setShowShare(false)} />}
    <div style={{ minHeight: "100vh", background: T.bg, color: T.white, fontFamily: font, paddingBottom: 100, animation: "slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
    <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(180deg, #0D2818 0%, rgba(13,40,24,0.6) 60%, transparent 100%)",
        padding: "16px 16px 24px", position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{
            background: T.grayD, border: `1px solid ${T.border}`, borderRadius: 99,
            padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", color: T.gray,
          }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>Session Report</div>
            <div style={{ color: T.gray, fontSize: 12, marginTop: 2 }}>Session 12 of ~36 · ACL Rehabilitation</div>
          </div>
        </div>
        {/* Meta row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {[
            { icon: Calendar, text: "Apr 22, 2026" },
            { icon: Clock, text: "09:14 AM" },
            { icon: FileText, text: "Duration: 24 min" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 5, background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: 8, padding: "5px 10px" }}>
              <Icon size={12} color={T.gray} />
              <span style={{ color: T.gray, fontSize: 12 }}>{text}</span>
            </div>
          ))}
        </div>
        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: `linear-gradient(135deg, ${T.green}, ${T.greenDeep})`,
            border: "none", borderRadius: 10, padding: "10px 0", cursor: "pointer",
            fontWeight: 700, fontSize: 13, color: "#fff", fontFamily: font,
            boxShadow: `0 4px 16px ${T.greenGlow}`,
          }}>
            <Download size={15} /> Export PDF
          </button>
          <button onClick={() => setShowShare(true)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: "transparent", border: `1.5px solid ${T.green}`,
            borderRadius: 10, padding: "10px 0", cursor: "pointer",
            fontWeight: 700, fontSize: 13, color: T.green, fontFamily: font,
          }}>
            <Share2 size={15} /> Share with PT
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Section 1: KPIs ── */}
        <div>
          <SectionTitle>Performance Summary</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {kpis.map(k => <KPICard key={k.title} {...k} />)}
          </div>
        </div>

        {/* ── Section 2: Rep Table ── */}
        <div>
          <SectionTitle>Rep-by-Rep Breakdown</SectionTitle>
          <div style={{ background: T.glass, backdropFilter: "blur(20px)", border: `1px solid ${T.glassBorder}`, borderRadius: 16, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 1fr", background: "rgba(0,200,83,0.08)", borderBottom: `1px solid ${T.greenBorder}`, padding: "10px 14px" }}>
              {["Rep", "Knee", "Hip", "Sym.", "Form"].map(h => (
                <div key={h} style={{ color: T.green, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, textAlign: "center" }}>{h}</div>
              ))}
            </div>
            {repData.map((row, i) => {
              const formColor = row.form >= 90 ? T.green : row.form >= 80 ? T.orange : T.red;
              const symColor = row.sym >= 90 ? T.green : row.sym >= 80 ? T.orange : T.red;
              return (
                <div key={row.rep} style={{
                  display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 1fr",
                  padding: "12px 14px", borderBottom: i < repData.length - 1 ? `1px solid ${T.border}` : "none",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                  alignItems: "center",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: T.greenDim, border: `1px solid ${T.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: T.green, margin: "0 auto" }}>{row.rep}</div>
                  </div>
                  <div style={{ textAlign: "center", color: T.white, fontWeight: 700, fontSize: 14 }}>{row.knee}°</div>
                  <div style={{ textAlign: "center", color: T.white, fontWeight: 700, fontSize: 14 }}>{row.hip}°</div>
                  <div style={{ textAlign: "center", color: symColor, fontWeight: 700, fontSize: 14 }}>{row.sym}%</div>
                  <div style={{ textAlign: "center", color: formColor, fontWeight: 700, fontSize: 14 }}>{row.form}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 3: Trajectory ── */}
        <div>
          <SectionTitle>Recovery Trajectory</SectionTitle>
          <TrajectoryGraph currentWeek={patient?.week || 3} />
        </div>

        {/* ── Section 4: Joint Heatmap ── */}
        <div>
          <SectionTitle>Joint Analysis</SectionTitle>
          <JointHeatmap />
        </div>

        {/* ── Section 5: AI Summary ── */}
        <div>
          <SectionTitle>AI Coach Summary</SectionTitle>
          <div style={{ background: T.glass, backdropFilter: "blur(20px)", border: `1px solid ${T.glassBorder}`, borderRadius: 16, padding: "18px 16px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${T.greenDeep}, ${T.green})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 16, color: "#fff",
                boxShadow: `0 0 12px ${T.greenGlow}`,
              }}>V</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.green, marginBottom: 8 }}>AI Physical Therapist</div>
                <p style={{ color: "#D0D0D0", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {patientName} demonstrated strong progress in knee flexion ROM this session, achieving a new personal best of 112°. Symmetry scores remain high at 91%, indicating balanced bilateral loading. Minor form deviation was noted in rep 2 — likely fatigue-related. Recommend maintaining current progression pace and adding the quad set exercise next session.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 6: Next Session ── */}
        <div>
          <SectionTitle>Next Session Preview</SectionTitle>
          <div style={{
            background: "linear-gradient(135deg, rgba(0,200,83,0.08), rgba(27,94,32,0.06))",
            border: `1px solid ${T.greenBorder}`, borderRadius: 16, padding: "20px 16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 4 }}>Next Exercise</div>
                <div style={{ fontWeight: 900, fontSize: 20, color: T.white }}>Long Arc Quad</div>
                <div style={{ color: T.green, fontSize: 13, marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                  <Calendar size={13} /> Scheduled: Tomorrow
                </div>
              </div>
              <div style={{ background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 10, padding: "8px 12px", textAlign: "center" }}>
                <div style={{ color: T.gray, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }}>Goal</div>
                <div style={{ color: T.green, fontWeight: 900, fontSize: 18, marginTop: 2 }}>115°</div>
                <div style={{ color: T.gray, fontSize: 10 }}>knee flex</div>
              </div>
            </div>
            <button style={{
              width: "100%", background: `linear-gradient(135deg, ${T.green}, ${T.greenDeep})`,
              border: "none", borderRadius: 12, padding: "14px 0", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: font, fontWeight: 800, fontSize: 15, color: "#fff",
              boxShadow: `0 4px 20px ${T.greenGlow}`,
            }}>
              <Play size={18} fill="white" /> Start When Ready
            </button>
          </div>
        </div>

        {/* ── View All Progress ── */}
        {onViewProgress && (
          <button onClick={onViewProgress} style={{
            width: "100%", background: T.glass, backdropFilter: "blur(20px)",
            border: `1px solid ${T.glassBorder}`, borderRadius: 14, padding: "14px 0",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: font, fontWeight: 700, fontSize: 14, color: T.gray,
          }}>
            <BarChart2 size={16} /> View All Progress Analytics
          </button>
        )}

      </div>
    </div>
    </>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 3, height: 18, borderRadius: 2, background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
      <h2 style={{ fontWeight: 800, fontSize: 14, color: T.white, textTransform: "uppercase", letterSpacing: 0.8, margin: 0 }}>{children}</h2>
    </div>
  );
}
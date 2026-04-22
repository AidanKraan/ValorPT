import { useState, useRef } from "react";
import { TrendingUp, TrendingDown, Flame, Award, Target, Calendar, CheckCircle, Star, Zap } from "lucide-react";
import { FileText } from "lucide-react";

const T = {
  bg: "#0A0A0A", surface: "#111111", surface2: "#161616",
  glass: "rgba(255,255,255,0.04)", glassBorder: "rgba(255,255,255,0.08)",
  green: "#00C853", greenDeep: "#1B5E20", greenMid: "#2E7D32",
  greenDim: "rgba(0,200,83,0.12)", greenGlow: "rgba(0,200,83,0.25)",
  greenBorder: "rgba(0,200,83,0.3)", white: "#FFFFFF",
  gray: "#A0A0A0", grayD: "#2A2A2A", border: "rgba(255,255,255,0.08)",
  orange: "#FF9500", red: "#FF3B30", yellow: "#FFD60A",
};
const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

/* ── Data ── */
const ROM_SESSIONS = {
  knee:  [65, 72, 80, 88, 94, 100, 105, 108, 110, 113, 115, 116, 117],
  hip:   [42, 48, 55, 60, 66, 70,  74,  78,  80,  82,  84,  85,  86],
  ankle: [18, 20, 22, 24, 25, 26,  27,  28,  28,  29,  29,  30,  30],
};
const BENCHMARK = {
  knee:  [60, 68, 76, 84, 90, 96, 101, 105, 108, 111, 113, 115, 116],
  hip:   [40, 46, 52, 58, 63, 67,  71,  74,  77,  79,  81,  83,  84],
  ankle: [16, 18, 20, 22, 24, 25,  26,  27,  28,  28,  29,  30,  30],
};
const SYM_SESSIONS = [73, 75, 78, 80, 82, 84, 86, 87, 89, 90, 91, 92, 93];
const MILESTONES = [
  { week: 1, label: "Started Program",         status: "done",    icon: Star },
  { week: 2, label: "Achieved 90° Flexion",    status: "done",    icon: Award },
  { week: 3, label: "Target 115° Flexion",     status: "current", icon: Target },
  { week: 4, label: "Begin Phase 2",           status: "future",  icon: Zap },
  { week: 6, label: "Return to Sport Assess.", status: "future",  icon: CheckCircle },
];

/* Compliance calendar — 12 weeks × 7 days */
function genCalendar() {
  const rows = [];
  for (let w = 0; w < 12; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      if (w < 2) days.push(Math.random() > 0.15 ? 2 : 1);       // early weeks: mostly done
      else if (w < 3) days.push(Math.random() > 0.2 ? 2 : 1);
      else if (w === 3 && d <= 4) days.push([2,2,2,1,2][d]);    // current week partial
      else if (w === 3 && d > 4) days.push(0);                   // future days this week
      else days.push(0);                                          // future weeks
    }
    rows.push(days);
  }
  return rows;
}
const CALENDAR = genCalendar();

/* ── Shared helpers ── */
function SectionLabel({ children }) {
  return (
    <div style={{ color: T.gray, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
      {children}
    </div>
  );
}

function GlassCard({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: T.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${glow ? T.greenBorder : T.glassBorder}`,
      borderRadius: 16, padding: 18,
      boxShadow: glow ? `0 0 24px ${T.greenGlow}` : "none",
      ...style,
    }}>{children}</div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: "none", border: "none", cursor: "pointer",
      padding: "10px 4px", fontFamily: font, fontSize: 13, fontWeight: active ? 700 : 500,
      color: active ? T.green : T.gray,
      borderBottom: `2px solid ${active ? T.green : "transparent"}`,
      transition: "all 0.2s",
    }}>{label}</button>
  );
}

/* ── OVERVIEW ── */
function OverviewTab({ patient }) {
  const pct = 47;
  const r = 70, circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  const trends = [
    { label: "Peak ROM", val: "117°", prev: "113°", up: true, color: T.green },
    { label: "Symmetry", val: "93%",  prev: "91%",  up: true, color: T.orange },
    { label: "Sessions", val: "4",    prev: "3",    up: true, color: "#00B8FF" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero ring */}
      <GlassCard glow style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 28, paddingBottom: 24 }}>
        <div style={{ position: "relative", width: 160, height: 160 }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
            <defs>
              <linearGradient id="heroGrad" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8BC34A" />
                <stop offset="100%" stopColor="#1B5E20" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r={r} fill="none" stroke={T.grayD} strokeWidth="10" />
            <circle cx="80" cy="80" r={r} fill="none" stroke="url(#heroGrad)" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
              style={{ filter: "drop-shadow(0 0 12px rgba(0,200,83,0.7))", transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: T.white, fontWeight: 900, fontSize: 38, lineHeight: 1 }}>{pct}%</div>
            <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }}>Complete</div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ color: T.white, fontWeight: 800, fontSize: 18 }}>{patient.name}</div>
          <div style={{ color: T.green, fontSize: 13, marginTop: 4 }}>Week {patient.week} of 6 · Phase {patient.phase} ACL Rehab</div>
        </div>
      </GlassCard>

      {/* Trend cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {trends.map(t => (
          <GlassCard key={t.label} style={{ padding: "14px 10px", textAlign: "center" }}>
            <div style={{ color: T.gray, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{t.label}</div>
            <div style={{ color: t.color, fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{t.val}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginTop: 6 }}>
              {t.up ? <TrendingUp size={11} color={T.green} /> : <TrendingDown size={11} color={T.red} />}
              <span style={{ color: T.gray, fontSize: 10 }}>{t.prev} last wk</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Milestone timeline */}
      <GlassCard>
        <SectionLabel>Milestone Timeline</SectionLabel>
        <div style={{ overflowX: "auto", paddingBottom: 8 }}>
          <div style={{ display: "flex", gap: 0, minWidth: 480, position: "relative" }}>
            {/* connector line */}
            <div style={{ position: "absolute", top: 20, left: 24, right: 24, height: 2, background: T.grayD, zIndex: 0 }} />
            {MILESTONES.map((m, i) => {
              const done = m.status === "done";
              const cur = m.status === "current";
              const dotColor = done ? T.green : cur ? T.green : T.grayD;
              const textColor = done ? T.white : cur ? T.green : T.gray;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: done ? T.greenDim : cur ? T.greenDim : T.surface2,
                    border: `2px solid ${dotColor}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: (done || cur) ? `0 0 12px ${T.greenGlow}` : "none",
                    animation: cur ? "pulseBorder 2s ease-in-out infinite" : "none",
                  }}>
                    <m.icon size={16} color={done || cur ? T.green : T.gray} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: T.gray, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }}>Wk {m.week}</div>
                    <div style={{ color: textColor, fontSize: 10, fontWeight: cur ? 700 : 500, lineHeight: 1.3, marginTop: 2, maxWidth: 70 }}>{m.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/* ── ROM TAB ── */
function ROMTab() {
  const [joint, setJoint] = useState("knee");
  const data = ROM_SESSIONS[joint];
  const bench = BENCHMARK[joint];
  const W = 340, H = 180, pad = { t: 14, b: 28, l: 32, r: 10 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const allVals = [...data, ...bench];
  const mn = Math.min(...allVals) - 4, mx = Math.max(...allVals) + 8;

  const toPt = (arr) => arr.map((v, i) => ({
    x: pad.l + (i / (arr.length - 1)) * cw,
    y: pad.t + ch - ((v - mn) / (mx - mn)) * ch,
  }));

  const makePath = (pts) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (pts[i-1].x + pts[i].x) / 2;
      d += ` C ${cx} ${pts[i-1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
    }
    return d;
  };

  const pts = toPt(data);
  const bPts = toPt(bench);
  const d = makePath(pts);
  const bd = makePath(bPts);
  const area = `${d} L ${pts[pts.length-1].x} ${pad.t+ch} L ${pts[0].x} ${pad.t+ch} Z`;

  const avg = Math.round(data.reduce((a,b) => a+b,0) / data.length);
  const trend = data[data.length-1] - data[data.length-4];

  const jointMeta = {
    knee:  { label: "Knee Flexion", unit: "°", color: T.green },
    hip:   { label: "Hip Flexion",  unit: "°", color: T.orange },
    ankle: { label: "Ankle Dorsiflexion", unit: "°", color: "#00B8FF" },
  };
  const meta = jointMeta[joint];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Joint toggle */}
      <div style={{ display: "flex", gap: 8 }}>
        {["knee", "hip", "ankle"].map(j => (
          <button key={j} onClick={() => setJoint(j)} style={{
            flex: 1, padding: "9px 0", borderRadius: 99, border: `1.5px solid ${joint===j ? meta.color : T.border}`,
            background: joint===j ? `${meta.color}18` : "transparent",
            color: joint===j ? meta.color : T.gray, fontWeight: 700, fontSize: 13,
            cursor: "pointer", fontFamily: font, transition: "all 0.2s",
            textTransform: "capitalize",
          }}>{j}</button>
        ))}
      </div>

      {/* Main graph */}
      <GlassCard style={{ padding: "18px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>{meta.label}</div>
            <div style={{ color: meta.color, fontWeight: 900, fontSize: 30, lineHeight: 1, marginTop: 4 }}>
              {data[data.length-1]}{meta.unit}
            </div>
          </div>
          <div style={{
            background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 8, padding: "5px 10px",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <TrendingUp size={12} color={T.green} />
            <span style={{ color: T.green, fontSize: 11, fontWeight: 700 }}>+{trend}{meta.unit} / 4 sessions</span>
          </div>
        </div>

        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
          <defs>
            <linearGradient id={`romGrad_${joint}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={meta.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={meta.color} stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
            const y = pad.t + f * ch;
            const v = Math.round(mx - f * (mx - mn));
            return (
              <g key={i}>
                <line x1={pad.l} y1={y} x2={W-pad.r} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <text x={pad.l-4} y={y+4} textAnchor="end" fill={T.gray} fontSize="9" fontFamily={font}>{v}</text>
              </g>
            );
          })}
          {/* Session labels */}
          {pts.map((pt, i) => (
            i % 2 === 0 && <text key={i} x={pt.x} y={H-2} textAnchor="middle" fill={T.gray} fontSize="8" fontFamily={font}>S{i+1}</text>
          ))}
          {/* Benchmark dashed line */}
          <path d={bd} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round" />
          {/* Area + line */}
          <path d={area} fill={`url(#romGrad_${joint})`} />
          <path d={d} fill="none" stroke={meta.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 5px ${meta.color}70)` }} />
          {/* Dots */}
          {pts.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="4" fill={meta.color} style={{ filter: `drop-shadow(0 0 4px ${meta.color})` }} />
              <circle cx={pt.x} cy={pt.y} r="2" fill="white" />
            </g>
          ))}
        </svg>

        {/* Benchmark legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <div style={{ width: 20, height: 2, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} />
          <span style={{ color: T.gray, fontSize: 10 }}>Avg of 1,000+ ACL patients</span>
        </div>
      </GlassCard>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        {[
          { label: "Min", val: `${Math.min(...data)}°` },
          { label: "Max", val: `${Math.max(...data)}°` },
          { label: "Avg", val: `${avg}°` },
          { label: "Trend", val: `+${trend}°`, color: T.green },
        ].map(s => (
          <GlassCard key={s.label} style={{ padding: "12px 8px", textAlign: "center" }}>
            <div style={{ color: T.gray, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            <div style={{ color: s.color || T.white, fontWeight: 900, fontSize: 18, marginTop: 5 }}>{s.val}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ── SYMMETRY TAB ── */
function SymmetryTab() {
  const current = SYM_SESSIONS[SYM_SESSIONS.length - 1];
  const barColor = (v) => v >= 90 ? T.green : v >= 80 ? T.orange : T.red;

  const W = 340, H = 130, pad = { t: 10, b: 28, l: 8, r: 8 };
  const bw = (W - pad.l - pad.r) / SYM_SESSIONS.length - 4;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Current score */}
      <GlassCard glow style={{ textAlign: "center", paddingTop: 28, paddingBottom: 28 }}>
        <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Current Symmetry Score</div>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="70" cy="70" r="60" fill="none" stroke={T.grayD} strokeWidth="10" />
            <circle cx="70" cy="70" r="60" fill="none" stroke={T.green} strokeWidth="10"
              strokeLinecap="round" strokeDasharray={2*Math.PI*60} strokeDashoffset={2*Math.PI*60*(1-current/100)}
              style={{ filter: `drop-shadow(0 0 10px ${T.green}90)`, transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
          </svg>
          <div style={{ position: "absolute", textAlign: "center" }}>
            <div style={{ color: T.green, fontWeight: 900, fontSize: 36, lineHeight: 1 }}>{current}%</div>
            <div style={{ color: T.gray, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>symmetry</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
          {[{ label: "Left", val: "47%" }, { label: "Right", val: "53%" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ color: T.white, fontWeight: 800, fontSize: 20 }}>{s.val}</div>
              <div style={{ color: T.gray, fontSize: 11 }}>{s.label} Load</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Split body bar */}
      <GlassCard>
        <SectionLabel>Load Distribution</SectionLabel>
        <div style={{ position: "relative", height: 20, background: T.grayD, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "47%", background: `linear-gradient(90deg, ${T.greenDeep}, ${T.green})`, borderRadius: 99 }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", color: T.white, fontSize: 11, fontWeight: 700, zIndex: 1 }}>|</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ color: T.green, fontSize: 12, fontWeight: 700 }}>Left (operative) 47%</span>
          <span style={{ color: T.gray, fontSize: 12, fontWeight: 700 }}>Right 53%</span>
        </div>
      </GlassCard>

      {/* Bar chart */}
      <GlassCard style={{ padding: "18px 14px 10px" }}>
        <SectionLabel>Symmetry per Session</SectionLabel>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
          {/* Threshold lines */}
          {[80, 90].map(v => {
            const y = pad.t + (H - pad.t - pad.b) * (1 - (v - 60) / 50);
            return (
              <g key={v}>
                <line x1={pad.l} y1={y} x2={W-pad.r} y2={y} stroke={v===90?T.green:T.orange} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
                <text x={pad.l} y={y-3} fill={v===90?T.green:T.orange} fontSize="8" fontFamily={font}>{v}%</text>
              </g>
            );
          })}
          {SYM_SESSIONS.map((v, i) => {
            const barH = (H - pad.t - pad.b) * ((v - 60) / 50);
            const x = pad.l + i * ((W - pad.l - pad.r) / SYM_SESSIONS.length) + 2;
            const y = H - pad.b - barH;
            const isLast = i === SYM_SESSIONS.length - 1;
            return (
              <g key={i}>
                <rect x={x} y={y} width={bw} height={barH} rx="4"
                  fill={barColor(v)} opacity={isLast ? 1 : 0.7}
                  style={{ filter: isLast ? `drop-shadow(0 0 6px ${barColor(v)}80)` : "none" }} />
                <text x={x + bw/2} y={H-4} textAnchor="middle" fill={T.gray} fontSize="8" fontFamily={font}>S{i+1}</text>
              </g>
            );
          })}
        </svg>
        {/* Legend */}
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          {[{ color: T.green, label: ">90%" }, { color: T.orange, label: "80–90%" }, { color: T.red, label: "<80%" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              <span style={{ color: T.gray, fontSize: 10 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ── COMPLIANCE TAB ── */
function ComplianceTab() {
  const cellColor = (v) => v === 2 ? T.green : v === 1 ? `${T.green}55` : T.grayD;
  const total = CALENDAR.flat().filter(v => v > 0).length;
  const done = CALENDAR.flat().filter(v => v === 2).length;
  const pct = Math.round((done / Math.max(total, 1)) * 100);

  // Best week
  let bestWeek = 0, bestWkIdx = 0;
  CALENDAR.forEach((wk, i) => {
    const score = wk.filter(d => d === 2).length;
    if (score > bestWeek) { bestWeek = score; bestWkIdx = i; }
  });

  const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <GlassCard glow style={{ padding: "16px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Flame size={24} color={T.orange} />
            <div>
              <div style={{ color: T.orange, fontWeight: 900, fontSize: 26, lineHeight: 1 }}>5</div>
              <div style={{ color: T.gray, fontSize: 11, marginTop: 2 }}>day streak 🔥</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard style={{ padding: "16px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Target size={24} color={T.green} />
            <div>
              <div style={{ color: T.green, fontWeight: 900, fontSize: 26, lineHeight: 1 }}>{pct}%</div>
              <div style={{ color: T.gray, fontSize: 11, marginTop: 2 }}>overall rate</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Calendar */}
      <GlassCard>
        <SectionLabel>Session Calendar — 12 Weeks</SectionLabel>
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 3, minWidth: CALENDAR.length * 20 }}>
            {/* Day labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 2 }}>
              {DAYS.map((d, i) => (
                <div key={i} style={{ width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: T.gray, fontSize: 8, fontWeight: 600 }}>{i % 2 === 0 ? d : ""}</span>
                </div>
              ))}
            </div>
            {CALENDAR.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {week.map((day, di) => (
                  <div key={di} style={{
                    width: 12, height: 12, borderRadius: 3,
                    background: cellColor(day),
                    boxShadow: day === 2 ? `0 0 4px ${T.green}60` : "none",
                    border: wi === bestWkIdx && day === 2 ? `1px solid ${T.green}` : "none",
                  }} />
                ))}
              </div>
            ))}
          </div>
          {/* Week numbers */}
          <div style={{ display: "flex", gap: 3, marginTop: 4, marginLeft: 16 }}>
            {CALENDAR.map((_, wi) => (
              <div key={wi} style={{ width: 12, textAlign: "center" }}>
                {wi % 3 === 0 && <span style={{ color: T.gray, fontSize: 7 }}>W{wi+1}</span>}
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center" }}>
          <span style={{ color: T.gray, fontSize: 10 }}>Less</span>
          {[T.grayD, `${T.green}55`, T.green].map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
          ))}
          <span style={{ color: T.gray, fontSize: 10 }}>More</span>
        </div>
      </GlassCard>

      {/* Best week */}
      <GlassCard style={{ border: `1px solid ${T.greenBorder}` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: T.greenDim, border: `1px solid ${T.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={20} color={T.green} />
          </div>
          <div>
            <div style={{ color: T.white, fontWeight: 800, fontSize: 15 }}>Best Week: Week {bestWkIdx + 1}</div>
            <div style={{ color: T.gray, fontSize: 13, marginTop: 2 }}>{bestWeek} out of 7 days completed ⭐</div>
          </div>
        </div>
      </GlassCard>

      {/* Progress bar */}
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ color: T.gray, fontSize: 12 }}>Total sessions completed</span>
          <span style={{ color: T.green, fontWeight: 700, fontSize: 12 }}>{done} / {total} days</span>
        </div>
        <div style={{ height: 8, background: T.grayD, borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${T.greenDeep}, ${T.green})`,
            borderRadius: 99, boxShadow: `0 0 8px ${T.green}60`,
            transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>
      </GlassCard>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function ProgressDashboard({ patient, onViewReport }) {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "ROM", "symmetry", "compliance"];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.white, paddingBottom: 100, fontFamily: font }}>
      <style>{`
        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 12px rgba(0,200,83,0.4); }
          50% { box-shadow: 0 0 22px rgba(0,200,83,0.8); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #0D2818 0%, rgba(13,40,24,0.4) 60%, transparent 100%)",
        padding: "24px 20px 0",
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: T.white, margin: 0, letterSpacing: -0.5 }}>Analytics</h1>
        <p style={{ color: T.gray, fontSize: 13, margin: "4px 0 16px" }}>Your recovery in detail</p>

        {/* Tab bar */}
        <div style={{
          display: "flex", borderBottom: `1px solid ${T.border}`,
          background: "rgba(8,8,8,0.6)", backdropFilter: "blur(12px)",
          margin: "0 -20px", padding: "0 20px",
        }}>
          {tabs.map(t => (
            <Tab key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} active={tab === t} onClick={() => setTab(t)} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 0" }}>
        {tab === "overview"    && <OverviewTab patient={patient} />}
        {tab === "ROM"         && <ROMTab />}
        {tab === "symmetry"    && <SymmetryTab />}
        {tab === "compliance"  && <ComplianceTab />}
      </div>

      {onViewReport && (
        <div style={{ padding: "16px 16px 0" }}>
          <button onClick={onViewReport} style={{
            width: "100%", background: T.glass, backdropFilter: "blur(20px)",
            border: `1px solid ${T.glassBorder}`, borderRadius: 14, padding: "14px",
            color: T.gray, fontFamily: font, fontWeight: 700, fontSize: 14,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <FileText size={16} /> View Last Session Report
          </button>
        </div>
      )}
    </div>
  );
}
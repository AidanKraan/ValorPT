import { useState, useEffect, useRef, useCallback } from "react";

// ─── Color Palette ───────────────────────────────────────────────
const C = {
  bg: "#0a1a0e",
  bgCard: "#0f2414",
  bgCardAlt: "#122918",
  green: "#1B5E20",
  greenMid: "#2E7D32",
  greenLight: "#4CAF50",
  greenAccent: "#66BB6A",
  greenPale: "#A5D6A7",
  white: "#F1F8F2",
  whiteD: "#C8E6C9",
  gray: "#6B8F6E",
  grayD: "#2a3d2d",
  red: "#EF5350",
  yellow: "#FFA726",
  border: "#1e3d22",
};

// ─── Sample Data ─────────────────────────────────────────────────
const SAMPLE_PATIENT = {
  id: 1,
  name: "Alex Johnson",
  week: 3,
  phase: 1,
  surgeryDate: "2026-04-01",
  compliance: 87,
  lastSession: "2026-04-20",
  flagged: false,
  photo: null,
};

const CLINICIAN_PATIENTS = [
  { id: 1, name: "Alex Johnson", phase: 1, week: 3, lastSession: "Apr 20", compliance: 87, flagged: false },
  { id: 2, name: "Maria Santos", phase: 2, week: 5, lastSession: "Apr 19", compliance: 72, flagged: true },
  { id: 3, name: "Derek Okafor", phase: 1, week: 2, lastSession: "Apr 21", compliance: 95, flagged: false },
  { id: 4, name: "Priya Nair", phase: 2, week: 6, lastSession: "Apr 18", compliance: 61, flagged: true },
];

const PHASE1_EXERCISES = [
  { id: 1, name: "Lying Heel Slides", sets: "3 × 15", metric: "ROM (°)", phase: 1 },
  { id: 2, name: "Seated Heel Slides", sets: "3 × 15", metric: "ROM (°)", phase: 1 },
  { id: 3, name: "Straight Leg Raises", sets: "3 × 10", metric: "Symmetry (%)", phase: 1 },
  { id: 4, name: "Long Arc Quad", sets: "3 × 15", metric: "Peak Extension (°)", phase: 1 },
  { id: 5, name: "Two-Leg Air Squats (60°)", sets: "3 × 12", metric: "Depth (°)", phase: 1 },
  { id: 6, name: "Two-Leg Air Squats (30°)", sets: "3 × 12", metric: "Symmetry (%)", phase: 1 },
];

const PHASE2_EXERCISES = [
  { id: 7, name: "Single Leg Squat 50% depth", sets: "3 × 10", metric: "Symmetry (%)", phase: 2 },
  { id: 8, name: "Single Leg Squat max depth", sets: "3 × 8", metric: "Peak Flexion (°)", phase: 2 },
  { id: 9, name: "Step-Ups", sets: "3 × 12", metric: "Hip Stability (°)", phase: 2 },
  { id: 10, name: "Forward Lunges", sets: "3 × 10", metric: "Symmetry (%)", phase: 2 },
];

const ROM_DATA = [65, 68, 71, 74, 78, 82, 87, 92, 97, 103, 108, 113, 115];
const SYM_DATA = [74, 76, 78, 79, 81, 83, 85, 86, 88, 89, 91, 92, 93];

const BADGES = [
  { icon: "🏆", label: "First Session", earned: true },
  { icon: "📐", label: "Reached 90° Flexion", earned: true },
  { icon: "📅", label: "Week 2 Complete", earned: true },
  { icon: "🔥", label: "5-Day Streak", earned: false },
  { icon: "⚡", label: "Phase 2 Ready", earned: false },
];

// ─── Tiny Components ─────────────────────────────────────────────

function ValorLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={C.greenMid} />
      <path d="M10 12 L20 30 L30 12" stroke={C.white} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="20" cy="30" r="2.5" fill={C.greenAccent} />
    </svg>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style = {}, disabled = false }) {
  const base = {
    padding: "14px 24px",
    borderRadius: 12,
    border: "none",
    fontWeight: 700,
    fontSize: 15,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    opacity: disabled ? 0.5 : 1,
    letterSpacing: 0.3,
  };
  const variants = {
    primary: { background: C.greenMid, color: C.white },
    secondary: { background: C.grayD, color: C.whiteD, border: `1px solid ${C.border}` },
    danger: { background: "#b71c1c", color: C.white },
    ghost: { background: "transparent", color: C.greenAccent, border: `1px solid ${C.greenMid}` },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ─── Mini Line Chart ──────────────────────────────────────────────
function LineChart({ data, color = C.greenAccent, label = "", minVal, maxVal, height = 120 }) {
  const w = 300, h = height;
  const pad = { t: 10, b: 24, l: 36, r: 10 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const mn = minVal !== undefined ? minVal : Math.min(...data) - 5;
  const mx = maxVal !== undefined ? maxVal : Math.max(...data) + 5;
  const pts = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * cw;
    const y = pad.t + ch - ((v - mn) / (mx - mn)) * ch;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area = `${pad.l},${pad.t + ch} ${polyline} ${pad.l + cw},${pad.t + ch}`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = pad.t + f * ch;
        const v = Math.round(mx - f * (mx - mn));
        return (
          <g key={i}>
            <line x1={pad.l} y1={y} x2={pad.l + cw} y2={y} stroke={C.border} strokeWidth="1" />
            <text x={pad.l - 4} y={y + 4} textAnchor="end" fill={C.gray} fontSize="9">{v}</text>
          </g>
        );
      })}
      <polygon points={area} fill={`url(#grad-${label})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((pt, i) => {
        const [x, y] = pt.split(",");
        return <circle key={i} cx={x} cy={y} r="3" fill={color} stroke={C.bgCard} strokeWidth="1.5" />;
      })}
      {/* x-axis labels */}
      {data.map((_, i) => {
        if (data.length > 8 && i % 2 !== 0) return null;
        const x = pad.l + (i / (data.length - 1)) * cw;
        return <text key={i} x={x} y={h - 4} textAnchor="middle" fill={C.gray} fontSize="9">W{Math.ceil((i + 1) * 6 / data.length)}</text>;
      })}
    </svg>
  );
}

// Session rep chart
function RepChart({ data }) {
  const w = 320, h = 100;
  const pad = { t: 10, b: 20, l: 30, r: 10 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const mn = 0, mx = 135;
  const pts = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * cw;
    const y = pad.t + ch - ((v - mn) / (mx - mn)) * ch;
    return `${x},${y}`;
  });
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.greenAccent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={C.greenAccent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 45, 90, 135].map((v, i) => {
        const y = pad.t + ch - ((v - mn) / (mx - mn)) * ch;
        return <g key={i}>
          <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke={C.border} strokeWidth="1" />
          <text x={pad.l - 4} y={y + 4} textAnchor="end" fill={C.gray} fontSize="9">{v}°</text>
        </g>;
      })}
      <polygon points={`${pad.l},${pad.t + ch} ${pts.join(" ")} ${w - pad.r},${pad.t + ch}`} fill="url(#repGrad)" />
      <polyline points={pts.join(" ")} fill="none" stroke={C.greenAccent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Contribution Calendar (compliance heatmap)
function ContribCalendar() {
  const weeks = 12;
  const days = ["M", "W", "F"];
  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const rand = Math.random();
    return rand > 0.35 ? (rand > 0.7 ? 2 : 1) : 0;
  });
  const colors = ["#1a2f1d", C.greenMid, C.greenAccent];
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {Array.from({ length: 7 }).map((_, d) => (
            <div key={d} style={{
              width: 12, height: 12, borderRadius: 3,
              background: colors[cells[w * 7 + d]],
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Pose Overlay Canvas ──────────────────────────────────────────
function PoseCanvas({ metrics }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      tRef.current += 0.025;
      const t = tRef.current;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Skeleton joints (simulated body position)
      const kneeAngle = metrics.kneeAngle; // degrees
      const rad = (kneeAngle * Math.PI) / 180;

      // Joint positions (normalized, squat motion)
      const shoulderL = { x: W * 0.38, y: H * 0.28 };
      const shoulderR = { x: W * 0.62, y: H * 0.28 };
      const hipL = { x: W * 0.4, y: H * 0.48 };
      const hipR = { x: W * 0.6, y: H * 0.48 };

      // Knee rises as flexion increases
      const kneeOffset = (kneeAngle / 130) * H * 0.12;
      const kneeL = { x: W * 0.38, y: H * 0.65 - kneeOffset };
      const kneeR = { x: W * 0.62, y: H * 0.65 - kneeOffset };

      const ankleL = { x: W * 0.36, y: H * 0.82 };
      const ankleR = { x: W * 0.64, y: H * 0.82 };
      const head = { x: W * 0.5, y: H * 0.13 };
      const neck = { x: W * 0.5, y: H * 0.22 };

      const joints = [shoulderL, shoulderR, hipL, hipR, kneeL, kneeR, ankleL, ankleR, head, neck];

      // Draw skeleton lines
      const drawBone = (a, b, color = "rgba(102,187,106,0.7)") => {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.stroke();
      };

      drawBone(neck, shoulderL);
      drawBone(neck, shoulderR);
      drawBone(shoulderL, hipL);
      drawBone(shoulderR, hipR);
      drawBone(hipL, hipR);
      drawBone(hipL, kneeL);
      drawBone(hipR, kneeR);
      drawBone(kneeL, ankleL);
      drawBone(kneeR, ankleR);
      drawBone(head, neck);

      // Draw joints
      const drawJoint = (pt, color, r = 7) => {
        // Glow
        const grd = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r * 2.5);
        grd.addColorStop(0, color.replace(")", ",0.5)").replace("rgb", "rgba"));
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        // Dot
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };

      joints.forEach(j => drawJoint(j, C.greenAccent));
      // Highlight knee joints
      drawJoint(kneeL, "#FFA726", 8);
      drawJoint(kneeR, "#FFA726", 8);

      // Draw angle arc at knee
      const drawAngleArc = (knee, hip, ankle) => {
        const a1 = Math.atan2(hip.y - knee.y, hip.x - knee.x);
        const a2 = Math.atan2(ankle.y - knee.y, ankle.x - knee.x);
        ctx.beginPath();
        ctx.arc(knee.x, knee.y, 22, a1, a2, false);
        ctx.strokeStyle = "rgba(255,167,38,0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#FFA726";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(`${kneeAngle}°`, knee.x + 14, knee.y - 10);
      };
      drawAngleArc(kneeL, hipL, ankleL);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [metrics.kneeAngle]);

  return (
    <canvas ref={canvasRef} width={400} height={340}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
  );
}

// ─── Webcam View ──────────────────────────────────────────────────
function WebcamFeed({ metrics }) {
  const videoRef = useRef(null);
  const [camActive, setCamActive] = useState(false);
  const [camError, setCamError] = useState(null);

  useEffect(() => {
    let stream = null;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setCamActive(true);
      })
      .catch(() => setCamError(true));
    return () => stream && stream.getTracks().forEach(t => t.stop());
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: 340, background: "#000", borderRadius: 14, overflow: "hidden", border: `2px solid ${C.greenMid}` }}>
      {camActive ? (
        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bgCardAlt }}>
          {camError ? (
            <>
              <div style={{ fontSize: 40 }}>📷</div>
              <div style={{ color: C.gray, fontSize: 13, marginTop: 8, textAlign: "center" }}>Camera access denied<br />Using simulation mode</div>
            </>
          ) : (
            <div style={{ color: C.gray, fontSize: 13 }}>Activating camera…</div>
          )}
        </div>
      )}
      <PoseCanvas metrics={metrics} />
      {/* LIVE badge */}
      <div style={{ position: "absolute", top: 12, left: 12, background: C.red, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: 1 }}>● LIVE</div>
    </div>
  );
}

// ─── ANIMATED METRICS HOOK ────────────────────────────────────────
function useAnimatedMetrics(phase, exerciseName) {
  const [metrics, setMetrics] = useState({ kneeAngle: 20, hipFlex: 15, symmetry: 82, reps: 0, timer: 0 });
  const repRef = useRef({ count: 0, phase: "down", lastRepTime: Date.now(), startTime: Date.now() });

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.04;
      const now = Date.now();
      const elapsed = (now - repRef.current.startTime) / 1000;

      // Simulate squat/exercise motion
      const maxKnee = phase === 2 ? 115 : 95;
      const rawKnee = Math.round(20 + ((Math.sin(t) + 1) / 2) * (maxKnee - 20));
      const hipFlex = Math.round(10 + ((Math.sin(t + 0.3) + 1) / 2) * 65);
      const symmetry = Math.round(83 + Math.sin(t * 1.7) * 7);

      // Count reps when flexion crosses threshold
      const threshold = maxKnee * 0.8;
      if (rawKnee > threshold && repRef.current.phase === "down") {
        repRef.current.phase = "up";
      } else if (rawKnee < 30 && repRef.current.phase === "up") {
        repRef.current.phase = "down";
        repRef.current.count = Math.min(repRef.current.count + 1, 15);
      }

      setMetrics({ kneeAngle: rawKnee, hipFlex, symmetry, reps: repRef.current.count, timer: Math.floor(elapsed) });
    }, 80);
    return () => clearInterval(interval);
  }, [phase, exerciseName]);

  return metrics;
}

// ─── Screens ──────────────────────────────────────────────────────

// PATIENT: Login
function PatientLogin({ onBegin }) {
  const [name, setName] = useState("Alex Johnson");
  const [phase, setPhase] = useState(1);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <ValorLogo size={72} />
        <h1 style={{ color: C.white, fontSize: 32, fontWeight: 900, margin: "16px 0 4px", letterSpacing: -1 }}>ValorPT</h1>
        <p style={{ color: C.gray, fontSize: 14 }}>Clinical AI Motion Analysis</p>
      </div>

      <Card style={{ width: "100%", maxWidth: 380 }}>
        <label style={{ color: C.whiteD, fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Patient Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          style={{ width: "100%", background: C.grayD, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", color: C.white, fontSize: 15, marginBottom: 18, boxSizing: "border-box" }}
        />

        <label style={{ color: C.whiteD, fontSize: 13, fontWeight: 600, marginBottom: 10, display: "block" }}>Rehab Phase</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[1, 2].map(p => (
            <div key={p} onClick={() => setPhase(p)} style={{
              flex: 1, padding: "12px 0", textAlign: "center", borderRadius: 10,
              border: `2px solid ${phase === p ? C.greenAccent : C.border}`,
              background: phase === p ? "rgba(76,175,80,0.12)" : "transparent",
              cursor: "pointer", color: phase === p ? C.greenAccent : C.gray,
              fontWeight: 700, fontSize: 14, transition: "all 0.2s",
            }}>
              Phase {p}<br />
              <span style={{ fontSize: 11, fontWeight: 400, color: C.gray }}>{p === 1 ? "Weeks 1–3" : "Weeks 4–6"}</span>
            </div>
          ))}
        </div>

        <Btn onClick={() => name && onBegin({ name, phase })} style={{ width: "100%" }}>
          Begin Session →
        </Btn>
      </Card>

      <p style={{ color: C.grayD, fontSize: 12, marginTop: 24 }}>ValorPT v2.1 · HIPAA Compliant</p>
    </div>
  );
}

// PATIENT: Program Dashboard
function ProgramDashboard({ patient, onStartSession, onGoProgress }) {
  const allExercises = patient.phase === 1 ? PHASE1_EXERCISES : PHASE2_EXERCISES;
  const completed = 3;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, paddingBottom: 80 }}>
      <div style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ValorLogo size={36} />
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>ACL Rehabilitation Program</h2>
            <p style={{ margin: 0, color: C.greenAccent, fontSize: 13 }}>Week {patient.week} · Phase {patient.phase}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: C.whiteD, fontSize: 12 }}>Program Progress</span>
            <span style={{ color: C.greenAccent, fontSize: 12, fontWeight: 700 }}>{Math.round((patient.week / 6) * 100)}%</span>
          </div>
          <div style={{ height: 6, background: C.grayD, borderRadius: 99 }}>
            <div style={{ height: "100%", width: `${(patient.week / 6) * 100}%`, background: `linear-gradient(90deg, ${C.greenMid}, ${C.greenAccent})`, borderRadius: 99, transition: "width 0.5s" }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        <h3 style={{ color: C.greenPale, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 14px" }}>
          Phase {patient.phase} — {patient.phase === 1 ? "ROM & Quad Activation" : "Strength & Functional Control"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {allExercises.map((ex, i) => (
            <Card key={ex.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", cursor: "pointer" }}
              onClick={() => onStartSession(ex)}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                background: i < completed ? "rgba(76,175,80,0.2)" : C.grayD,
                border: `2px solid ${i < completed ? C.greenAccent : C.border}`,
                flexShrink: 0,
              }}>
                {i < completed ? <span style={{ fontSize: 16 }}>✓</span> : <span style={{ color: C.gray, fontSize: 13, fontWeight: 700 }}>{i + 1}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</div>
                <div style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>{ex.sets} · {ex.metric}</div>
              </div>
              <div style={{ color: C.border, fontSize: 18 }}>›</div>
            </Card>
          ))}
        </div>

        <Btn onClick={() => onStartSession(allExercises[completed])} style={{ width: "100%", marginTop: 24, padding: "16px 24px" }}>
          Start Today's Session
        </Btn>
      </div>
    </div>
  );
}

// PATIENT: Exercise Session
function ExerciseSession({ patient, exercise, onComplete, onBack }) {
  const metrics = useAnimatedMetrics(patient.phase, exercise?.name);
  const [setsDone, setSetsDone] = useState(0);
  const totalSets = 3;

  const repHistory = useRef([]);
  useEffect(() => {
    repHistory.current.push(metrics.kneeAngle);
    if (repHistory.current.length > 60) repHistory.current = repHistory.current.slice(-60);
  }, [metrics.kneeAngle]);

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const instructions = {
    "Lying Heel Slides": "Lie flat on your back. Slowly slide your heel toward your buttocks, bending your knee as far as comfortable. Hold 2s, return slowly.",
    "Seated Heel Slides": "Sit in a chair. Slide your heel back under the chair bending your knee. Hold 2s at maximum bend.",
    "Straight Leg Raises": "Lie on your back, tighten your quad, raise leg to 45°. Hold 2s. Lower slowly.",
    "Long Arc Quad": "Sit at edge of table. Straighten leg fully, hold 5s, lower slowly. Focus on full extension.",
    "Single Leg Squat 50% depth": "Stand on operated leg. Slowly lower to half squat depth. Keep knee aligned over toe.",
    "Single Leg Squat max depth": "Stand on operated leg. Lower as deep as comfortable maintaining alignment.",
  };
  const instr = instructions[exercise?.name] || "Perform the movement slowly and controlled. Maintain knee alignment throughout.";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.gray, fontSize: 22, cursor: "pointer", padding: 0 }}>‹</button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{exercise?.name}</div>
          <div style={{ color: C.greenAccent, fontSize: 12 }}>Phase {patient.phase} · Set {setsDone + 1} of {totalSets}</div>
        </div>
        <div style={{ marginLeft: "auto", background: C.grayD, borderRadius: 8, padding: "6px 12px", color: C.greenAccent, fontWeight: 700, fontSize: 14 }}>
          {formatTime(metrics.timer)}
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Webcam */}
        <div style={{ position: "relative" }}>
          <WebcamFeed metrics={metrics} />
        </div>

        {/* Live metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Knee Flexion", value: `${metrics.kneeAngle}°`, color: C.yellow },
            { label: "Hip Flexion", value: `${metrics.hipFlex}°`, color: C.greenAccent },
            { label: "Symmetry", value: `${metrics.symmetry}%`, color: metrics.symmetry >= 80 ? C.greenAccent : C.red },
            { label: "Reps", value: metrics.reps, color: C.greenPale },
          ].map(m => (
            <Card key={m.label} style={{ textAlign: "center", padding: "12px 8px" }}>
              <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{m.label}</div>
              <div style={{ color: m.color, fontSize: 28, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card style={{ padding: "12px 16px" }}>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Instructions</div>
          <div style={{ color: C.whiteD, fontSize: 13, lineHeight: 1.6 }}>{instr}</div>
        </Card>

        {/* Complete set */}
        <Btn onClick={() => { if (setsDone < totalSets - 1) setSetsDone(s => s + 1); else onComplete({ metrics, exercise }); }}
          style={{ width: "100%", padding: "16px" }}>
          {setsDone < totalSets - 1 ? `Complete Set ${setsDone + 1}` : "Finish Exercise →"}
        </Btn>
      </div>
    </div>
  );
}

// PATIENT: Session Results
function SessionResults({ result, patient, onNext, onEnd }) {
  const peakKnee = 108;
  const avgSym = 87;
  const repsCompleted = 15;

  // Simulated rep-by-rep flexion data
  const repFlexData = [22, 45, 78, 95, 102, 108, 104, 99, 107, 105, 103, 108, 106, 107, 108];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, paddingBottom: 80 }}>
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.greenMid}, ${C.green})`, padding: "28px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 44 }}>🎯</div>
        <h2 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: 900 }}>Exercise Complete!</h2>
        <p style={{ margin: 0, color: C.greenPale, fontSize: 14 }}>{result?.exercise?.name}</p>
      </div>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Key metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Peak Flexion", value: `${peakKnee}°`, sub: "↑ 6° vs last", color: C.greenAccent },
            { label: "Avg Symmetry", value: `${avgSym}%`, sub: "↑ 3% vs last", color: C.greenAccent },
            { label: "Reps", value: repsCompleted, sub: "Target: 15", color: C.white },
          ].map(m => (
            <Card key={m.label} style={{ textAlign: "center", padding: "12px 8px" }}>
              <div style={{ color: C.gray, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{m.label}</div>
              <div style={{ color: m.color, fontSize: 22, fontWeight: 900 }}>{m.value}</div>
              <div style={{ color: C.greenAccent, fontSize: 10, marginTop: 3 }}>{m.sub}</div>
            </Card>
          ))}
        </div>

        {/* Rep chart */}
        <Card>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Knee Flexion by Rep</div>
          <RepChart data={repFlexData} />
        </Card>

        {/* Comparison */}
        <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 28 }}>📈</div>
          <div>
            <div style={{ fontWeight: 700, color: C.greenAccent }}>Great progress!</div>
            <div style={{ color: C.whiteD, fontSize: 13, marginTop: 2 }}>Peak flexion improved 6° vs your last session. Keep it up!</div>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={onNext} style={{ flex: 2 }}>Next Exercise →</Btn>
          <Btn onClick={onEnd} variant="ghost" style={{ flex: 1 }}>End Session</Btn>
        </div>
      </div>
    </div>
  );
}

// PATIENT: Progress Dashboard
function ProgressDashboard({ patient }) {
  const weekLabel = `Week ${patient.week} of 6`;
  const sessions = [
    { date: "Apr 14", exercises: 5, peak: 82 },
    { date: "Apr 16", exercises: 6, peak: 87 },
    { date: "Apr 18", exercises: 5, peak: 94 },
    { date: "Apr 20", exercises: 6, peak: 102 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, paddingBottom: 80 }}>
      <div style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.greenMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            {patient.name[0]}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{patient.name}</div>
            <div style={{ color: C.greenAccent, fontSize: 13 }}>{weekLabel}</div>
          </div>
          <div style={{ marginLeft: "auto", background: "rgba(76,175,80,0.15)", borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
            <div style={{ color: C.greenAccent, fontWeight: 800, fontSize: 18 }}>4</div>
            <div style={{ color: C.gray, fontSize: 11 }}>day streak 🔥</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Knee Flexion ROM Progress</div>
          <LineChart data={ROM_DATA} label="rom" minVal={55} maxVal={125} height={130} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ color: C.gray, fontSize: 12 }}>Start: 65°</span>
            <span style={{ color: C.greenAccent, fontWeight: 700, fontSize: 12 }}>Current: 108°</span>
            <span style={{ color: C.gray, fontSize: 12 }}>Goal: 120°</span>
          </div>
        </Card>

        <Card>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Symmetry Score Trend</div>
          <LineChart data={SYM_DATA} label="sym" minVal={65} maxVal={100} height={110} color="#FFA726" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ color: C.gray, fontSize: 12 }}>Start: 74%</span>
            <span style={{ color: "#FFA726", fontWeight: 700, fontSize: 12 }}>Current: 91%</span>
          </div>
        </Card>

        {/* Badges */}
        <Card>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Milestones</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {BADGES.map(b => (
              <div key={b.label} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                opacity: b.earned ? 1 : 0.35, minWidth: 64,
              }}>
                <div style={{ fontSize: 28 }}>{b.icon}</div>
                <div style={{ color: b.earned ? C.greenPale : C.gray, fontSize: 10, textAlign: "center", lineHeight: 1.3 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent sessions */}
        <Card>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Recent Sessions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sessions.map(s => (
              <div key={s.date} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ color: C.greenAccent, fontSize: 22 }}>📋</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.date}</div>
                  <div style={{ color: C.gray, fontSize: 12 }}>{s.exercises} exercises completed</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: C.greenAccent, fontWeight: 700, fontSize: 15 }}>{s.peak}°</div>
                  <div style={{ color: C.gray, fontSize: 11 }}>peak flexion</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── CLINICIAN SCREENS ────────────────────────────────────────────

function ClinicianDashboard({ onSelectPatient, onAddPatient }) {
  const [search, setSearch] = useState("");
  const filtered = CLINICIAN_PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white }}>
      <div style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ValorLogo size={32} />
            <span style={{ fontWeight: 800, fontSize: 18 }}>Clinician Dashboard</span>
          </div>
          <Btn onClick={onAddPatient} variant="ghost" style={{ padding: "8px 14px", fontSize: 13 }}>+ Add Patient</Btn>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search patients…"
          style={{ width: "100%", background: C.grayD, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.white, fontSize: 14, boxSizing: "border-box" }}
        />
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, padding: "16px 16px 0" }}>
        {[
          { label: "Active Patients", value: 4, icon: "👥" },
          { label: "Avg Compliance", value: "78%", icon: "📊" },
          { label: "Flagged", value: 2, icon: "🚩" },
        ].map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "12px 8px" }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 20, margin: "4px 0 2px" }}>{s.value}</div>
            <div style={{ color: C.gray, fontSize: 11 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ padding: "16px" }}>
        <h3 style={{ color: C.greenPale, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>Patient List</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(p => (
            <Card key={p.id} onClick={() => onSelectPatient(p)} style={{ cursor: "pointer", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.greenMid, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                  {p.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                    {p.flagged && <span style={{ color: C.red, fontSize: 14 }}>🚩</span>}
                  </div>
                  <div style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>Phase {p.phase} · Week {p.week} · Last: {p.lastSession}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: p.compliance >= 80 ? C.greenAccent : p.compliance >= 65 ? C.yellow : C.red, fontWeight: 800, fontSize: 16 }}>{p.compliance}%</div>
                  <div style={{ color: C.gray, fontSize: 11 }}>compliance</div>
                </div>
              </div>
              {/* Compliance bar */}
              <div style={{ height: 4, background: C.grayD, borderRadius: 99, marginTop: 10 }}>
                <div style={{ height: "100%", width: `${p.compliance}%`, background: p.compliance >= 80 ? C.greenAccent : p.compliance >= 65 ? C.yellow : C.red, borderRadius: 99, transition: "width 0.5s" }} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClinicianPatientView({ patient, onBack }) {
  const alerts = patient.flagged ? ["Knee flexion plateaued for 5 days", "Missed 2 consecutive sessions"] : [];

  const exBreakdown = [
    { name: "Lying Heel Slides", completed: 9, total: 12, avgFlex: 88 },
    { name: "Seated Heel Slides", completed: 11, total: 12, avgFlex: 82 },
    { name: "Straight Leg Raises", completed: 10, total: 12, avgSym: "84%" },
    { name: "Long Arc Quad", completed: 8, total: 12, avgFlex: 79 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, paddingBottom: 40 }}>
      <div style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.gray, fontSize: 22, cursor: "pointer", padding: 0 }}>‹</button>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Patient Report</span>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Patient header */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.greenMid, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22 }}>
              {patient.name.split(" ").map(w => w[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                {patient.name} {patient.flagged && <span style={{ color: C.red }}>🚩</span>}
              </div>
              <div style={{ color: C.greenAccent, fontSize: 13 }}>Phase {patient.phase} · Week {patient.week}</div>
              <div style={{ color: C.gray, fontSize: 12 }}>Surgery: 2026-04-01</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: patient.compliance >= 80 ? C.greenAccent : C.yellow, fontWeight: 900, fontSize: 22 }}>{patient.compliance}%</div>
              <div style={{ color: C.gray, fontSize: 11 }}>compliance</div>
            </div>
          </div>
        </Card>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card style={{ border: `1px solid ${C.red}`, background: "rgba(239,83,80,0.08)" }}>
            <div style={{ color: C.red, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>⚠ Clinical Alerts</div>
            {alerts.map((a, i) => (
              <div key={i} style={{ color: C.whiteD, fontSize: 13, padding: "6px 0", borderBottom: i < alerts.length - 1 ? `1px solid rgba(239,83,80,0.2)` : "none" }}>
                • {a}
              </div>
            ))}
          </Card>
        )}

        {/* ROM Graph */}
        <Card>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Knee Flexion ROM Over Time</div>
          <LineChart data={ROM_DATA.slice(0, patient.week * 2)} label={`rom-${patient.id}`} minVal={55} maxVal={125} height={130} />
        </Card>

        {/* Symmetry */}
        <Card>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Symmetry Score Over Time</div>
          <LineChart data={SYM_DATA.slice(0, patient.week * 2)} label={`sym-${patient.id}`} minVal={65} maxVal={100} height={110} color="#FFA726" />
        </Card>

        {/* Compliance calendar */}
        <Card>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Session Compliance (12 weeks)</div>
          <div style={{ overflowX: "auto" }}>
            <ContribCalendar />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
            <span style={{ color: C.gray, fontSize: 11 }}>Less</span>
            {["#1a2f1d", C.greenMid, C.greenAccent].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
            ))}
            <span style={{ color: C.gray, fontSize: 11 }}>More</span>
          </div>
        </Card>

        {/* Exercise breakdown */}
        <Card>
          <div style={{ color: C.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Exercise Breakdown</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Exercise", "Done/Total", "Avg Metric"].map(h => (
                  <th key={h} style={{ color: C.gray, fontWeight: 600, fontSize: 11, textAlign: "left", paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exBreakdown.map((r, i) => (
                <tr key={r.name} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "9px 0", color: C.whiteD, fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: "9px 0" }}>
                    <span style={{ color: C.greenAccent, fontWeight: 700 }}>{r.completed}</span>
                    <span style={{ color: C.gray }}>/{r.total}</span>
                  </td>
                  <td style={{ padding: "9px 0", color: C.greenAccent, fontWeight: 700 }}>
                    {r.avgFlex ? `${r.avgFlex}°` : r.avgSym}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────
function BottomNav({ active, onNav }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "program", icon: "📋", label: "Program" },
    { id: "record", icon: "⏺", label: "Record" },
    { id: "progress", icon: "📈", label: "Progress" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
      background: C.bgCard, borderTop: `1px solid ${C.border}`, display: "flex",
      padding: "8px 0 env(safe-area-inset-bottom, 8px)",
      zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNav(t.id)} style={{
          flex: 1, background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "4px 0",
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 10, color: active === t.id ? C.greenAccent : C.gray, fontWeight: active === t.id ? 700 : 400 }}>{t.label}</span>
          {active === t.id && <div style={{ width: 20, height: 2, background: C.greenAccent, borderRadius: 1 }} />}
        </button>
      ))}
    </div>
  );
}

// Top Clinician Nav
function TopNav({ active, onNav }) {
  const tabs = [
    { id: "patients", label: "Patients" },
    { id: "analytics", label: "Analytics" },
    { id: "messages", label: "Messages" },
    { id: "settings", label: "Settings" },
  ];
  return (
    <div style={{ display: "flex", background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: "0 16px" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNav(t.id)} style={{
          background: "none", border: "none", padding: "14px 16px 12px",
          color: active === t.id ? C.greenAccent : C.gray,
          fontWeight: active === t.id ? 700 : 400,
          fontSize: 13, cursor: "pointer",
          borderBottom: active === t.id ? `2px solid ${C.greenAccent}` : "2px solid transparent",
          transition: "all 0.2s",
        }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────
export default function ValorPT() {
  const [mode, setMode] = useState("patient"); // patient | clinician
  const [patientScreen, setPatientScreen] = useState("login");
  const [clinicianScreen, setClinicianScreen] = useState("dashboard");
  const [patient, setPatient] = useState(SAMPLE_PATIENT);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeNav, setActiveNav] = useState("home");
  const [clinicNav, setClinicNav] = useState("patients");

  const handleNavPatient = (tab) => {
    setActiveNav(tab);
    if (tab === "home" || tab === "record") setPatientScreen("dashboard");
    if (tab === "program") setPatientScreen("dashboard");
    if (tab === "progress") setPatientScreen("progress");
  };

  const renderPatient = () => {
    switch (patientScreen) {
      case "login":
        return <PatientLogin onBegin={p => { setPatient({ ...SAMPLE_PATIENT, ...p }); setPatientScreen("dashboard"); }} />;
      case "dashboard":
        return <ProgramDashboard patient={patient} onStartSession={ex => { setCurrentExercise(ex); setPatientScreen("session"); }} onGoProgress={() => setPatientScreen("progress")} />;
      case "session":
        return <ExerciseSession patient={patient} exercise={currentExercise} onComplete={r => { setSessionResult(r); setPatientScreen("results"); }} onBack={() => setPatientScreen("dashboard")} />;
      case "results":
        return <SessionResults result={sessionResult} patient={patient} onNext={() => setPatientScreen("dashboard")} onEnd={() => setPatientScreen("dashboard")} />;
      case "progress":
        return <ProgressDashboard patient={patient} />;
      default:
        return null;
    }
  };

  const renderClinician = () => {
    switch (clinicianScreen) {
      case "dashboard":
        return <ClinicianDashboard onSelectPatient={p => { setSelectedPatient(p); setClinicianScreen("patient"); }} onAddPatient={() => {}} />;
      case "patient":
        return <ClinicianPatientView patient={selectedPatient} onBack={() => setClinicianScreen("dashboard")} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: C.bg,
      minHeight: "100vh",
      color: C.white,
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
      boxShadow: "0 0 60px rgba(0,0,0,0.6)",
    }}>
      {/* Mode toggle */}
      <div style={{
        position: "fixed", top: 12, right: 12, zIndex: 200,
        display: "flex", background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: 20, overflow: "hidden",
      }}>
        {["patient", "clinician"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "6px 14px", border: "none", cursor: "pointer",
            background: mode === m ? C.greenMid : "transparent",
            color: mode === m ? C.white : C.gray,
            fontWeight: mode === m ? 700 : 400,
            fontSize: 12, transition: "all 0.2s", textTransform: "capitalize",
          }}>
            {m === "patient" ? "🧑 Patient" : "🩺 Clinician"}
          </button>
        ))}
      </div>

      {/* Main content */}
      {mode === "patient" ? (
        <>
          {renderPatient()}
          {patientScreen !== "login" && (
            <BottomNav active={activeNav} onNav={handleNavPatient} />
          )}
        </>
      ) : (
        <>
          <TopNav active={clinicNav} onNav={tab => { setClinicNav(tab); if (tab === "patients") setClinicianScreen("dashboard"); }} />
          {renderClinician()}
        </>
      )}
    </div>
  );
}

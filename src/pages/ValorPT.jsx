import { useState, useEffect, useRef } from "react";
import {
  Home, ClipboardList, Circle, TrendingUp, User,
  CheckCircle, Play, Pause, Activity, Calendar, AlertTriangle,
  ChevronRight, ArrowRight, Search, Info, Camera,
  Flag, Plus, ChevronLeft, Zap, Target, Timer,
  BarChart2, Users, MessageSquare, Settings,
  Award, Flame, Star, Layers, Dumbbell, MoveUp, Repeat,
  Shield, Check, Stethoscope, Bone, Maximize2,
  Volume2, Eye, AlertCircle, BookOpen, Crosshair, FileText
} from "lucide-react";
import ValorLogo, { ValorIcon } from "../components/ValorLogo";
import AICoachDebrief from "../components/AICoachDebrief";
import SessionReport from "../components/SessionReport";
import ProgressDashboard from "../components/ProgressDashboard";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const T = {
  bg:          "#0A0A0A",
  surface:     "#111111",
  surface2:    "#161616",
  glass:       "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  green:       "#00C853",
  greenDeep:   "#1B5E20",
  greenMid:    "#2E7D32",
  greenDim:    "rgba(0,200,83,0.12)",
  greenGlow:   "rgba(0,200,83,0.25)",
  greenBorder: "rgba(0,200,83,0.3)",
  white:       "#FFFFFF",
  gray:        "#A0A0A0",
  grayD:       "#2A2A2A",
  border:      "rgba(255,255,255,0.08)",
  red:         "#FF3B30",
  orange:      "#FF9500",
};
const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
  input { outline: none; }
  button { outline: none; font-family: inherit; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes splashFadeIn {
    0%   { opacity: 0; transform: scale(0.9); }
    60%  { opacity: 1; transform: scale(1.02); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes splashFadeOut { from { opacity: 1; } to { opacity: 0; } }
  @keyframes liveGlow {
    0%, 100% { box-shadow: 0 0 6px 2px rgba(0,200,83,0.7); }
    50%       { box-shadow: 0 0 14px 4px rgba(0,200,83,0.3); }
  }
  @keyframes playPulse {
    0%   { transform: scale(1);    box-shadow: 0 0 0 0   rgba(0,200,83,0.6); }
    50%  { transform: scale(1.04); box-shadow: 0 0 0 18px rgba(0,200,83,0); }
    100% { transform: scale(1);    box-shadow: 0 0 0 0   rgba(0,200,83,0); }
  }
  @keyframes ambientDrift {
    0%   { transform: translate(0%,0%) scale(1); }
    25%  { transform: translate(8%,-12%) scale(1.08); }
    50%  { transform: translate(-6%,8%) scale(0.95); }
    75%  { transform: translate(10%,5%) scale(1.05); }
    100% { transform: translate(0%,0%) scale(1); }
  }
  @keyframes ambientDrift2 {
    0%   { transform: translate(0%,0%) scale(1); }
    33%  { transform: translate(-10%,8%) scale(1.1); }
    66%  { transform: translate(6%,-10%) scale(0.92); }
    100% { transform: translate(0%,0%) scale(1); }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes celebrationCheckmark {
    0%   { stroke-dashoffset: 200; opacity: 0; }
    30%  { opacity: 1; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes celebrationScale {
    0%   { transform: scale(0); opacity: 0; }
    60%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes ringFill { from { stroke-dashoffset: 502; } }
  @keyframes scrubPulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.5; }
  }

  .fadeUp  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .fadeUp2 { animation: fadeUp 0.5s 0.07s cubic-bezier(0.16,1,0.3,1) both; }
  .fadeUp3 { animation: fadeUp 0.5s 0.14s cubic-bezier(0.16,1,0.3,1) both; }
  .fadeUp4 { animation: fadeUp 0.5s 0.21s cubic-bezier(0.16,1,0.3,1) both; }
  .fadeUp5 { animation: fadeUp 0.5s 0.28s cubic-bezier(0.16,1,0.3,1) both; }

  .card-hover {
    transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .card-hover:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,200,83,0.14);
    border-color: rgba(0,200,83,0.25) !important;
  }
  .btn-press { transition: transform 0.15s, box-shadow 0.15s; }
  .btn-press:active { transform: scale(0.96) !important; }
  .live-pulse { animation: liveGlow 2s ease-in-out infinite; }
  .ring-animate { animation: ringFill 1.4s cubic-bezier(0.16,1,0.3,1) both; }
  .play-pulse { animation: playPulse 2.2s ease-in-out infinite; }
`;

/* ═══════════════════════════════════════════════════════════════
   EXERCISE DATABASE
═══════════════════════════════════════════════════════════════ */
const EXERCISE_DB = {
  "Lying Heel Slides": {
    phase: 1, sets: "3 × 15", metric: "ROM (°)", Icon: Activity,
    muscles: ["hamstrings", "knee_flexors"],
    duration: "0:12",
    steps: [
      "Lie flat on your back on a firm surface with both legs straight.",
      "Keep your core gently engaged and lower back flat against the surface.",
      "Slowly slide your operative heel toward your buttocks, bending the knee.",
      "Continue until you feel a gentle stretch or reach your comfortable range.",
      "Hold at maximum range for 2 seconds, then slowly return to start.",
      "Repeat for all reps, aiming to go slightly further each rep.",
    ],
    measures: ["Knee flexion angle (°)", "Rate of range improvement", "Symmetry vs. opposite leg", "Smoothness of motion arc"],
    mistakes: [
      { title: "Hiking the hip", desc: "Don't let your pelvis rotate — keep both hips flat on the surface." },
      { title: "Moving too fast", desc: "Control the return. Fast reps reduce therapeutic benefit." },
      { title: "Not reaching max range", desc: "Push gently to your comfortable limit each rep for progression." },
    ],
  },
  "Seated Heel Slides": {
    phase: 1, sets: "3 × 15", metric: "ROM (°)", Icon: Activity,
    muscles: ["hamstrings", "knee_flexors"],
    duration: "0:12",
    steps: [
      "Sit upright in a chair with your feet flat on the floor.",
      "Place your operative foot slightly forward of the other.",
      "Slide your heel backward under the chair, bending the knee.",
      "Go as far as comfortable, aiming to get your foot directly under the chair.",
      "Hold at peak flexion for 2 seconds.",
      "Slide foot forward slowly to starting position and repeat.",
    ],
    measures: ["Peak knee flexion angle (°)", "Bilateral symmetry (%)", "Smoothness of movement", "Time to peak flexion"],
    mistakes: [
      { title: "Leaning forward", desc: "Stay upright — slouching changes the loading pattern on the knee." },
      { title: "Forcing range", desc: "Never push into sharp pain — a stretch sensation is normal, pain is not." },
      { title: "Holding breath", desc: "Breathe out as you bend, in as you return." },
    ],
  },
  "Straight Leg Raises": {
    phase: 1, sets: "3 × 10", metric: "Symmetry (%)", Icon: MoveUp,
    muscles: ["quadriceps", "hip_flexors"],
    duration: "0:10",
    steps: [
      "Lie flat on your back with the non-operative leg bent, foot flat on the floor.",
      "Tighten the quad of your operative leg — you should feel the kneecap move up slightly.",
      "Keeping the knee fully locked straight, raise the leg to 45°.",
      "Hold at the top for 2 seconds, maintaining full quad contraction.",
      "Slowly lower the leg back to the surface.",
      "Do not let the knee bend during the movement.",
    ],
    measures: ["Hip flexion angle (°)", "Knee extension quality (°)", "Quad activation symmetry (%)", "Hold time consistency"],
    mistakes: [
      { title: "Knee bending", desc: "If the knee bends during the lift, the quads aren't fully engaged. Reset and try again." },
      { title: "Lower back arching", desc: "Keep the pelvis neutral — don't let your back lift off the surface." },
      { title: "Rushing the hold", desc: "The 2-second hold at top is critical for quad strengthening." },
    ],
  },
  "Long Arc Quad": {
    phase: 1, sets: "3 × 15", metric: "Peak Extension (°)", Icon: Dumbbell,
    muscles: ["quadriceps"],
    duration: "0:15",
    steps: [
      "Sit at the edge of a firm surface with thighs fully supported.",
      "Let both legs hang at approximately 90° knee flexion.",
      "Slowly straighten the operative leg, extending the knee fully.",
      "At the top, squeeze the quad hard and hold for 3–5 seconds.",
      "Slowly lower the leg back to 90° — take at least 3 seconds.",
      "Do not swing the leg — use only quad strength.",
    ],
    measures: ["Peak knee extension (°)", "Terminal extension quality", "Time under tension (s)", "Quad symmetry (%)"],
    mistakes: [
      { title: "Swinging the leg", desc: "Momentum defeats the purpose — move slowly and under control." },
      { title: "Skipping the hold", desc: "The hold at terminal extension is where the quad strengthening happens." },
      { title: "Short arc only", desc: "Make sure you start from full 90° flexion to get the full arc benefit." },
    ],
  },
  "Air Squats (60°)": {
    phase: 1, sets: "3 × 12", metric: "Depth (°)", Icon: Repeat,
    muscles: ["quadriceps", "glutes", "hamstrings", "ankles"],
    duration: "0:14",
    steps: [
      "Stand feet shoulder-width apart, toes turned slightly outward.",
      "Hold arms forward for balance.",
      "Slowly lower your hips by bending both knees to approximately 60°.",
      "Keep your chest up, weight through your heels, knees over your 2nd toes.",
      "Pause briefly at the bottom of your range.",
      "Drive through both heels equally to return to standing.",
    ],
    measures: ["Bilateral knee flexion (°)", "Knee-over-toe alignment", "Symmetry side-to-side (%)", "Hip descent rate"],
    mistakes: [
      { title: "Knees caving in", desc: "Drive knees outward throughout — think 'spread the floor' with your feet." },
      { title: "Heels rising", desc: "Weight must stay through the heels. If heels lift, reduce depth." },
      { title: "Leaning forward excessively", desc: "A slight lean is fine; excessive forward lean overloads the knee." },
    ],
  },
  "Air Squats (30°)": {
    phase: 1, sets: "3 × 12", metric: "Symmetry (%)", Icon: Repeat,
    muscles: ["quadriceps", "glutes", "hamstrings", "ankles"],
    duration: "0:14",
    steps: [
      "Same setup as 60° squat — feet shoulder-width, toes out slightly.",
      "Lower to only 30° of knee flexion — a very shallow dip.",
      "Focus entirely on equal weight distribution between both legs.",
      "Hold the bottom position for 1 second, checking symmetry.",
      "Return slowly to standing.",
      "This shallow depth maximizes symmetry training with minimal load.",
    ],
    measures: ["Bilateral symmetry (%)", "Knee flexion angle (°)", "Ground reaction force balance", "Trunk stability"],
    mistakes: [
      { title: "Going too deep", desc: "Resist the urge to go deeper — the goal here is symmetry at shallow depth." },
      { title: "Shifting weight", desc: "Watch for subtle weight shifting to the non-operative side." },
      { title: "Looking down", desc: "Keep gaze forward to maintain upright trunk position." },
    ],
  },
  "Single Leg Squat 50%": {
    phase: 2, sets: "3 × 10", metric: "Symmetry (%)", Icon: Shield,
    muscles: ["quadriceps", "glutes", "stabilizers"],
    duration: "0:16",
    steps: [
      "Stand on your operative leg, with the other foot lifted slightly.",
      "Place fingertips lightly on a wall or chair for safety — do not lean.",
      "Slowly lower your hips by bending the operative knee to approximately 50° depth.",
      "Keep your knee tracking directly over your 2nd toe throughout.",
      "Hold at the bottom for 1–2 seconds, maintaining control.",
      "Drive through the heel to return to full standing.",
    ],
    measures: ["Single-leg knee flexion (°)", "Trunk lateral lean angle", "Hip drop symmetry", "Knee medial collapse angle"],
    mistakes: [
      { title: "Knee diving inward", desc: "The most common error — keep the knee aligned over the foot at all times." },
      { title: "Leaning on support", desc: "Touch the wall for balance only — do not push through it." },
      { title: "Hip dropping", desc: "Keep your pelvis level. Hip drop indicates weak glute medius." },
    ],
  },
  "Single Leg Squat Max": {
    phase: 2, sets: "3 × 8", metric: "Peak Flexion (°)", Icon: Zap,
    muscles: ["quadriceps", "glutes", "stabilizers"],
    duration: "0:18",
    steps: [
      "Stand on your operative leg with the other leg extended or bent behind.",
      "Begin lowering slowly, maintaining full control of the movement.",
      "Continue to your maximum comfortable depth — note this as your baseline.",
      "Pause at the bottom and check knee alignment, hip position, and trunk angle.",
      "Drive through the heel to return — this is as demanding as the descent.",
      "Aim to increase depth by 5° each session as strength improves.",
    ],
    measures: ["Max single-leg knee flexion (°)", "Knee valgus angle (°)", "Trunk lean (°)", "Glute activation symmetry (%)"],
    mistakes: [
      { title: "Rushing depth", desc: "Progress depth gradually — jumping to max depth too soon increases re-injury risk." },
      { title: "Trunk excessive forward lean", desc: "Some lean is normal; excessive lean shifts stress to the patella." },
      { title: "Non-operative leg touching down", desc: "The unloaded foot must not touch down for assistance." },
    ],
  },
  "Step-Ups": {
    phase: 2, sets: "3 × 12", metric: "Hip Stability (°)", Icon: Layers,
    muscles: ["quadriceps", "glutes", "hip_extensors"],
    duration: "0:14",
    steps: [
      "Stand facing a step (approx. 20cm height) with your operative leg closest.",
      "Place the operative foot fully on the step.",
      "Drive through the operative heel to push your body up.",
      "Straighten the knee fully at the top — stand tall for 1 second.",
      "Slowly lower the non-operative foot back to the floor.",
      "Do not push off the floor with your lower foot — the step-up leg does the work.",
    ],
    measures: ["Hip extension angle at top (°)", "Trunk lateral lean", "Knee tracking alignment", "Step cadence consistency"],
    mistakes: [
      { title: "Pushing off the floor foot", desc: "The lower foot is for safety only. Do not use it to assist the step-up." },
      { title: "Not straightening at top", desc: "Full extension at the top is essential for hip and quad strengthening." },
      { title: "Stepping down too fast", desc: "The eccentric (lowering) phase is as important as the step-up." },
    ],
  },
  "Forward Lunges": {
    phase: 2, sets: "3 × 10", metric: "Symmetry (%)", Icon: Target,
    muscles: ["quadriceps", "hamstrings", "glutes"],
    duration: "0:16",
    steps: [
      "Stand tall with feet hip-width apart.",
      "Step forward with the operative leg, landing heel-first.",
      "Lower your back knee toward the floor, stopping 2–3cm above it.",
      "Keep your front knee directly over your foot — never past the toes.",
      "Drive through the front heel to push back to the starting position.",
      "Repeat for all reps on the operative leg before switching.",
    ],
    measures: ["Front knee flexion angle (°)", "Knee-toe distance ratio", "Trunk stability during lunge", "Step length symmetry (%)"],
    mistakes: [
      { title: "Front knee past toes", desc: "If your knee tracks far past your toes, shorten your step length." },
      { title: "Trunk collapsing forward", desc: "Keep an upright posture — a slight forward lean is acceptable." },
      { title: "Back knee crashing down", desc: "Control the descent of the back knee — don't let it drop." },
    ],
  },
};

/* Muscle group highlight data for anatomical SVG */
const MUSCLE_HIGHLIGHTS = {
  quadriceps:    { color: "#00C853", label: "Quadriceps" },
  hamstrings:    { color: "#00C853", label: "Hamstrings" },
  glutes:        { color: "#00A846", label: "Gluteals" },
  hip_flexors:   { color: "#69F0AE", label: "Hip Flexors" },
  hip_extensors: { color: "#69F0AE", label: "Hip Extensors" },
  knee_flexors:  { color: "#00C853", label: "Knee Flexors" },
  stabilizers:   { color: "#AED581", label: "Stabilizers" },
  ankles:        { color: "#B9F6CA", label: "Ankle Complex" },
};

const PHASE1_EXERCISES = [
  { id: 1, name: "Lying Heel Slides",   sets: "3 × 15", metric: "ROM (°)",            phase: 1, done: true,  Icon: Activity },
  { id: 2, name: "Seated Heel Slides",  sets: "3 × 15", metric: "ROM (°)",            phase: 1, done: true,  Icon: Activity },
  { id: 3, name: "Straight Leg Raises", sets: "3 × 10", metric: "Symmetry (%)",       phase: 1, done: true,  Icon: MoveUp },
  { id: 4, name: "Long Arc Quad",       sets: "3 × 15", metric: "Peak Extension (°)", phase: 1, done: false, Icon: Dumbbell },
  { id: 5, name: "Air Squats (60°)",    sets: "3 × 12", metric: "Depth (°)",          phase: 1, done: false, Icon: Repeat },
  { id: 6, name: "Air Squats (30°)",    sets: "3 × 12", metric: "Symmetry (%)",       phase: 1, done: false, Icon: Repeat },
];
const PHASE2_EXERCISES = [
  { id: 7,  name: "Single Leg Squat 50%", sets: "3 × 10", metric: "Symmetry (%)",     phase: 2, done: true,  Icon: Shield },
  { id: 8,  name: "Single Leg Squat Max", sets: "3 × 8",  metric: "Peak Flexion (°)", phase: 2, done: false, Icon: Zap },
  { id: 9,  name: "Step-Ups",             sets: "3 × 12", metric: "Hip Stability (°)",phase: 2, done: false, Icon: Layers },
  { id: 10, name: "Forward Lunges",       sets: "3 × 10", metric: "Symmetry (%)",     phase: 2, done: false, Icon: Target },
];
const SAMPLE_PATIENT = { id: 1, name: "Alex Johnson", week: 3, phase: 1, surgeryDate: "2026-04-01", compliance: 87, lastSession: "Apr 20", flagged: false };
const CLINICIAN_PATIENTS = [
  { id: 1, name: "Alex Johnson",  phase: 1, week: 3, lastSession: "Apr 20", compliance: 87, flagged: false },
  { id: 2, name: "Maria Santos",  phase: 2, week: 5, lastSession: "Apr 19", compliance: 72, flagged: true },
  { id: 3, name: "Derek Okafor",  phase: 1, week: 2, lastSession: "Apr 21", compliance: 95, flagged: false },
  { id: 4, name: "Priya Nair",    phase: 2, week: 6, lastSession: "Apr 18", compliance: 61, flagged: true },
];
const ROM_DATA = [65, 68, 72, 76, 80, 85, 90, 95, 100, 105, 110, 113, 115];
const SYM_DATA = [73, 75, 78, 80, 82, 84, 86, 87, 89, 90, 91, 92, 93];

/* ═══════════════════════════════════════════════════════════════
   VALOR LOGO — imported from components/ValorLogo.jsx
═══════════════════════════════════════════════════════════════ */
// ValorIcon, ValorLogo imported at top of file
function ValorWatermark({ size = 200 }) {
  return <div style={{ opacity: 0.06, pointerEvents: "none" }}><ValorIcon size={size}/></div>;
}

/* ═══════════════════════════════════════════════════════════════
   ANATOMICAL BODY SVG
═══════════════════════════════════════════════════════════════ */
function AnatomicalSVG({ muscles = [] }) {
  const active = new Set(muscles);
  const hi = (group) => active.has(group) ? (MUSCLE_HIGHLIGHTS[group]?.color || T.green) : "rgba(255,255,255,0.08)";
  const hl = (group) => active.has(group) ? "rgba(0,200,83,0.25)" : "transparent";

  return (
    <svg width="160" height="320" viewBox="0 0 160 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body outline — light strokes */}
      {/* Head */}
      <ellipse cx="80" cy="28" rx="20" ry="24" fill="#1A1A1A" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      {/* Neck */}
      <rect x="72" y="50" width="16" height="14" rx="4" fill="#1A1A1A" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      {/* Torso */}
      <path d="M45 64 L35 130 L55 130 L55 160 L105 160 L105 130 L125 130 L115 64 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
      {/* Shoulders */}
      <ellipse cx="38" cy="72" rx="14" ry="10" fill="#1A1A1A" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      <ellipse cx="122" cy="72" rx="14" ry="10" fill="#1A1A1A" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      {/* Arms */}
      <path d="M26 72 Q18 100 22 120 Q26 130 30 130 Q36 120 36 100 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <path d="M134 72 Q142 100 138 120 Q134 130 130 130 Q124 120 124 100 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      {/* Forearms */}
      <path d="M22 120 Q18 145 22 158 L30 158 Q34 145 30 130 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <path d="M138 120 Q142 145 138 158 L130 158 Q126 145 130 130 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

      {/* QUADRICEPS — front thighs */}
      <path d="M57 162 Q52 190 53 220 Q55 235 65 238 Q75 240 78 235 Q80 220 80 200 Q80 180 78 162 Z"
        fill={hl("quadriceps")} stroke={hi("quadriceps")} strokeWidth="2" opacity="0.9"/>
      <path d="M103 162 Q108 190 107 220 Q105 235 95 238 Q85 240 82 235 Q80 220 80 200 Q80 180 82 162 Z"
        fill={hl("quadriceps")} stroke={hi("quadriceps")} strokeWidth="2" opacity="0.9"/>
      {/* GLUTES */}
      <path d="M57 155 Q52 158 55 170 L80 170 L80 155 Z"
        fill={hl("glutes")} stroke={hi("glutes")} strokeWidth="2" opacity="0.85"/>
      <path d="M103 155 Q108 158 105 170 L80 170 L80 155 Z"
        fill={hl("glutes")} stroke={hi("glutes")} strokeWidth="2" opacity="0.85"/>
      {/* HAMSTRINGS — shown behind thighs (lower portion of thighs, slightly wider) */}
      <path d="M57 195 Q53 215 55 238 Q60 242 68 240 Q75 235 78 220 Q79 205 78 195 Z"
        fill={hl("hamstrings")} stroke={hi("hamstrings")} strokeWidth="2" opacity="0.8"/>
      <path d="M103 195 Q107 215 105 238 Q100 242 92 240 Q85 235 82 220 Q81 205 82 195 Z"
        fill={hl("hamstrings")} stroke={hi("hamstrings")} strokeWidth="2" opacity="0.8"/>
      {/* KNEE FLEXORS (lower hamstrings / posterior knee) */}
      <ellipse cx="66" cy="244" rx="12" ry="8"
        fill={hl("knee_flexors")} stroke={hi("knee_flexors")} strokeWidth="2" opacity="0.85"/>
      <ellipse cx="94" cy="244" rx="12" ry="8"
        fill={hl("knee_flexors")} stroke={hi("knee_flexors")} strokeWidth="2" opacity="0.85"/>
      {/* HIP FLEXORS */}
      <path d="M60 140 Q55 152 60 162 L80 160 L80 140 Z"
        fill={hl("hip_flexors")} stroke={hi("hip_flexors")} strokeWidth="2" opacity="0.85"/>
      <path d="M100 140 Q105 152 100 162 L80 160 L80 140 Z"
        fill={hl("hip_flexors")} stroke={hi("hip_flexors")} strokeWidth="2" opacity="0.85"/>
      {/* HIP EXTENSORS (glutes + upper hamstrings) */}
      <path d="M57 150 Q50 165 55 178 Q62 180 70 176 Q76 172 78 165 L78 150 Z"
        fill={hl("hip_extensors")} stroke={hi("hip_extensors")} strokeWidth="2" opacity="0.8"/>
      <path d="M103 150 Q110 165 105 178 Q98 180 90 176 Q84 172 82 165 L82 150 Z"
        fill={hl("hip_extensors")} stroke={hi("hip_extensors")} strokeWidth="2" opacity="0.8"/>
      {/* STABILIZERS (lateral hip, obliques) */}
      <path d="M40 110 Q34 130 38 145 Q44 148 50 144 Q56 138 57 128 Q56 116 50 112 Z"
        fill={hl("stabilizers")} stroke={hi("stabilizers")} strokeWidth="1.5" opacity="0.75"/>
      <path d="M120 110 Q126 130 122 145 Q116 148 110 144 Q104 138 103 128 Q104 116 110 112 Z"
        fill={hl("stabilizers")} stroke={hi("stabilizers")} strokeWidth="1.5" opacity="0.75"/>

      {/* Knees */}
      <ellipse cx="66" cy="248" rx="14" ry="10" fill="#1A1A1A" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
      <ellipse cx="94" cy="248" rx="14" ry="10" fill="#1A1A1A" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
      {/* Shins */}
      <path d="M54 256 Q52 282 54 302 Q58 308 66 308 Q74 308 76 302 Q78 282 78 256 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <path d="M106 256 Q108 282 106 302 Q102 308 94 308 Q86 308 84 302 Q82 282 82 256 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      {/* ANKLES */}
      <ellipse cx="66" cy="308" rx="13" ry="8"
        fill={hl("ankles")} stroke={hi("ankles")} strokeWidth="2" opacity="0.9"/>
      <ellipse cx="94" cy="308" rx="13" ry="8"
        fill={hl("ankles")} stroke={hi("ankles")} strokeWidth="2" opacity="0.9"/>
      {/* Feet */}
      <path d="M54 312 Q50 316 50 318 L82 318 L80 312 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <path d="M106 312 Q110 316 110 318 L78 318 L80 312 Z" fill="#1A1A1A" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

      {/* Center line */}
      <line x1="80" y1="50" x2="80" y2="162" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VIDEO PLAYER MOCKUP
═══════════════════════════════════════════════════════════════ */
function VideoPlayerMock({ exercise, data }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setPlaying(false); return 0; }
          return p + 1.2;
        });
      }, 150);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const ExIcon = data?.Icon || Activity;
  const dur = data?.duration || "0:12";

  return (
    <div style={{
      position: "relative", width: "100%", borderRadius: 18, overflow: "hidden",
      background: "linear-gradient(145deg, #0D1F10, #0A0A0A)",
      border: `1px solid ${T.greenBorder}`,
      boxShadow: `0 0 40px ${T.greenGlow}, 0 2px 0 rgba(255,255,255,0.04) inset`,
      aspectRatio: "16/9",
    }}>
      {/* Grid pattern background */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }} preserveAspectRatio="none">
        <defs>
          <pattern id="vpGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke={T.green} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vpGrid)"/>
      </svg>

      {/* Ambient glow behind player */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,200,83,0.12) 0%, transparent 65%)`, pointerEvents: "none" }}/>

      {/* Skeleton figure hint */}
      <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", opacity: 0.07, pointerEvents: "none" }}>
        <AnatomicalSVG muscles={[]}/>
      </div>

      {/* Center play button */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <button
          onClick={() => setPlaying(p => !p)}
          className="btn-press"
          style={{
            width: 72, height: 72, borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.green}, ${T.greenDeep})`,
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 0 12px rgba(0,200,83,0.12), 0 0 0 24px rgba(0,200,83,0.06)`,
            animation: !playing ? "playPulse 2.2s ease-in-out infinite" : "none",
            transition: "all 0.2s",
          }}>
          {playing
            ? <Pause size={28} color="#fff" fill="#fff"/>
            : <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: 4 }}/>
          }
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: T.white, fontWeight: 700, fontSize: 15, letterSpacing: -0.2 }}>{exercise}</div>
          <div style={{ color: T.gray, fontSize: 12, marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <ExIcon size={13}/>
            <span>Demonstration · {dur}</span>
          </div>
        </div>
      </div>

      {/* LIVE indicator */}
      <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: `1px solid ${T.greenBorder}`, borderRadius: 6, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "scrubPulse 1.5s ease-in-out infinite" }}/>
        <span style={{ color: T.white, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>DEMO</span>
      </div>

      {/* Duration badge */}
      <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", borderRadius: 6, padding: "4px 10px" }}>
        <span style={{ color: T.white, fontSize: 11, fontWeight: 600 }}>{dur}</span>
      </div>

      {/* Bottom controls bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)", padding: "20px 16px 12px" }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 99, marginBottom: 10, cursor: "pointer" }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress(((e.clientX - rect.left) / rect.width) * 100);
          }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${T.green}, #69F0AE)`, borderRadius: 99, boxShadow: `0 0 6px ${T.green}`, transition: playing ? "none" : "width 0.2s", position: "relative" }}>
            <div style={{ position: "absolute", right: -5, top: -4, width: 11, height: 11, borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}` }}/>
          </div>
        </div>
        {/* Control row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setPlaying(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", color: T.white, display: "flex" }}>
              {playing ? <Pause size={18}/> : <Play size={18} fill="white"/>}
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: T.gray, display: "flex" }}>
              <Volume2 size={16}/>
            </button>
            <span style={{ color: T.gray, fontSize: 11 }}>
              {playing ? `0:${String(Math.floor(progress * 0.12)).padStart(2,"0")}` : "0:00"} / {dur}
            </span>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: T.gray, display: "flex" }}>
            <Maximize2 size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXERCISE DETAIL PAGE
═══════════════════════════════════════════════════════════════ */
function ExerciseDetailPage({ exercise, onBack, onStartRecording }) {
  const data = EXERCISE_DB[exercise.name] || {};
  const muscles = data.muscles || [];
  const highlightedGroups = [...new Set(muscles)];

  return (
    <div className="fadeUp" style={{ minHeight: "100vh", background: T.bg, color: T.white, paddingBottom: 100 }}>
      {/* Back header */}
      <div style={{
        background: "linear-gradient(180deg, #0D2818 0%, transparent 100%)",
        padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,83,0.18) 0%, transparent 70%)", pointerEvents: "none" }}/>
        <button onClick={onBack} className="btn-press" style={{ background: T.grayD, border: `1px solid ${T.border}`, borderRadius: 99, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", color: T.gray }}>
          <ChevronLeft size={18}/>
        </button>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.3, color: T.white }}>{exercise.name}</div>
          <div style={{ color: T.green, fontSize: 12, marginTop: 1 }}>Phase {exercise.phase} · {exercise.sets}</div>
        </div>
        <div style={{ background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 8, padding: "4px 12px" }}>
          <span style={{ color: T.green, fontSize: 11, fontWeight: 700 }}>{exercise.metric}</span>
        </div>
      </div>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* VIDEO PLAYER */}
        <div className="fadeUp2">
          <VideoPlayerMock exercise={exercise.name} data={data}/>
        </div>

        {/* HOW TO PERFORM */}
        <div className="fadeUp3">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: T.greenDim, border: `1px solid ${T.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={16} color={T.green}/>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>How to Perform</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(data.steps || []).map((step, i) => (
              <div key={i} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                background: T.glass, backdropFilter: "blur(20px)",
                border: `1px solid ${T.glassBorder}`,
                borderRadius: 12, padding: "14px 16px",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: i < 2 ? T.greenDim : "transparent",
                  border: `1.5px solid ${i < 2 ? T.green : T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: i < 2 ? T.green : T.gray,
                  fontWeight: 800, fontSize: 13,
                  boxShadow: i < 2 ? `0 0 8px ${T.greenGlow}` : "none",
                }}>
                  {i + 1}
                </div>
                <p style={{ color: T.white, fontSize: 13, lineHeight: 1.65, marginTop: 4 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRIMARY MUSCLES */}
        <div className="fadeUp4">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: T.greenDim, border: `1px solid ${T.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Crosshair size={16} color={T.green}/>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>Primary Muscles</h2>
          </div>
          <div style={{ background: T.glass, backdropFilter: "blur(20px)", border: `1px solid ${T.glassBorder}`, borderRadius: 16, padding: "20px 16px" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {/* Anatomical figure */}
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <AnatomicalSVG muscles={muscles}/>
                <span style={{ color: T.gray, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Anterior view</span>
              </div>
              {/* Legend */}
              <div style={{ flex: 1 }}>
                <div style={{ color: T.gray, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 12 }}>Target Groups</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {highlightedGroups.map(g => (
                    <div key={g} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: MUSCLE_HIGHLIGHTS[g]?.color || T.green, boxShadow: `0 0 6px ${MUSCLE_HIGHLIGHTS[g]?.color || T.green}` }}/>
                      <span style={{ color: T.white, fontSize: 13, fontWeight: 600 }}>{MUSCLE_HIGHLIGHTS[g]?.label || g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WHAT THE CAMERA MEASURES */}
        <div className="fadeUp5">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: T.greenDim, border: `1px solid ${T.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Eye size={16} color={T.green}/>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>What the Camera Measures</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(data.measures || []).map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: T.glass, backdropFilter: "blur(20px)", border: `1px solid ${T.glassBorder}`, borderRadius: 12, padding: "12px 16px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, flexShrink: 0, boxShadow: `0 0 4px ${T.green}` }}/>
                <span style={{ color: T.whiteD, fontSize: 13, fontWeight: 500, color: "#E0E0E0" }}>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COMMON MISTAKES */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,59,48,0.1)", border: `1px solid rgba(255,59,48,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={16} color={T.red}/>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>Common Mistakes</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(data.mistakes || []).map((m, i) => (
              <div key={i} style={{ background: "rgba(255,59,48,0.05)", border: `1px solid rgba(255,59,48,0.2)`, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <AlertTriangle size={16} color={T.orange} style={{ flexShrink: 0, marginTop: 2 }}/>
                <div>
                  <div style={{ color: T.orange, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ color: T.gray, fontSize: 12, lineHeight: 1.6 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "8px 0 0" }}>
          <button
            className="btn-press"
            onClick={() => onStartRecording(exercise)}
            style={{
              width: "100%", minHeight: 56, borderRadius: 16,
              background: `linear-gradient(135deg, ${T.green} 0%, ${T.greenDeep} 100%)`,
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              fontFamily: font, fontWeight: 800, fontSize: 17, color: T.white,
              letterSpacing: -0.2,
              boxShadow: `0 6px 32px ${T.greenGlow}, 0 0 0 1px rgba(0,200,83,0.2)`,
            }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Circle size={20} fill="white" color="white"/>
            </div>
            Start Recording
          </button>
          <p style={{ color: T.gray, fontSize: 12, textAlign: "center", marginTop: 10 }}>
            Your camera will activate and AI motion analysis will begin
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════════════════════ */
function AmbientBg() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,83,0.055) 0%, transparent 65%)", top: "-15%", left: "20%", animation: "ambientDrift 22s ease-in-out infinite" }}/>
      <div style={{ position: "absolute", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle, rgba(27,94,32,0.07) 0%, transparent 65%)", bottom: "5%", right: "-10%", animation: "ambientDrift2 28s ease-in-out infinite" }}/>
      <div style={{ position: "absolute", width: "40%", height: "40%", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,83,0.04) 0%, transparent 65%)", top: "50%", left: "-5%", animation: "ambientDrift 35s ease-in-out infinite reverse" }}/>
    </div>
  );
}

function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1400);
    const t2 = setTimeout(onDone, 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, animation: fading ? "splashFadeOut 0.5s ease forwards" : "splashFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards" }}>
      <div style={{ animation: "scaleIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards" }}>
        <ValorLogo height={80} darkBg={true} />
      </div>
      <div style={{ animation: "fadeUp 0.6s 0.3s both", textAlign: "center" }}>
        <p style={{ color: T.gray, fontSize: 13, textAlign: "center", marginTop: 6, letterSpacing: 2, textTransform: "uppercase" }}>Clinical AI Motion Analysis</p>
      </div>
      <div style={{ animation: "fadeIn 0.4s 0.6s both" }}>
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke={T.grayD} strokeWidth="2.5"/>
          <circle cx="18" cy="18" r="15" fill="none" stroke={T.green} strokeWidth="2.5" strokeDasharray="94" strokeDashoffset="70" strokeLinecap="round" style={{ animation: "spin 1s linear infinite", transformOrigin: "50% 50%" }}/>
        </svg>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({ id: i, x: Math.random() * 100, delay: Math.random() * 0.8, duration: 1.8 + Math.random() * 1.2, size: 6 + Math.random() * 8, color: [T.green, "#8BC34A", "#AED581", "#00E676", "#69F0AE", "rgba(255,255,255,0.3)"][Math.floor(Math.random() * 6)], shape: Math.random() > 0.5 ? "circle" : "rect" }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 10 }}>
      {pieces.map(p => <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: 0, width: p.size, height: p.shape === "circle" ? p.size : p.size * 0.6, borderRadius: p.shape === "circle" ? "50%" : 2, background: p.color, animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards` }}/>)}
    </div>
  );
}

function CelebrationScreen({ exercise, onDone }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => { const p = Math.min((Date.now() - start) / 2000, 1); setProgress(p); if (p < 1) requestAnimationFrame(tick); else onDone(); };
    requestAnimationFrame(tick);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, animation: "fadeIn 0.3s ease" }}>
      <AmbientBg/><Confetti/>
      <div style={{ animation: "celebrationScale 0.6s cubic-bezier(0.16,1,0.3,1) forwards", position: "relative", zIndex: 2 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <defs><linearGradient id="celebGrad" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#00C853"/><stop offset="100%" stopColor="#1B5E20"/></linearGradient></defs>
          <circle cx="70" cy="70" r="65" fill="rgba(0,200,83,0.1)" stroke="rgba(0,200,83,0.3)" strokeWidth="1"/>
          <circle cx="70" cy="70" r="55" fill="rgba(0,200,83,0.08)"/>
          <path d="M40 70 L60 92 L100 50" stroke="url(#celebGrad)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="200" strokeDashoffset="0" style={{ animation: "celebrationCheckmark 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both" }}/>
        </svg>
        <div style={{ position: "absolute", inset: -8, borderRadius: "50%", boxShadow: `0 0 40px ${T.greenGlow}`, pointerEvents: "none" }}/>
      </div>
      <div style={{ textAlign: "center", animation: "fadeUp 0.5s 0.4s both", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "center" }}><ValorLogo height={56} darkBg={true} /></div>
        <h2 style={{ fontFamily: font, fontWeight: 900, fontSize: 34, color: T.white, marginTop: 16, letterSpacing: -0.8 }}>Great Work!</h2>
        <p style={{ color: T.gray, fontSize: 15, marginTop: 6 }}>{exercise?.name}</p>
      </div>
      <div style={{ display: "flex", gap: 16, animation: "fadeUp 0.5s 0.5s both", position: "relative", zIndex: 2 }}>
        {[{ label: "Peak ROM", val: "108°" }, { label: "Symmetry", val: "87%" }, { label: "Reps", val: "15" }].map(s => (
          <div key={s.label} style={{ background: T.glass, backdropFilter: "blur(20px)", border: `1px solid ${T.greenBorder}`, borderRadius: 14, padding: "14px 20px", textAlign: "center", boxShadow: `0 0 20px ${T.greenGlow}` }}>
            <div style={{ color: T.green, fontWeight: 900, fontSize: 24 }}>{s.val}</div>
            <div style={{ color: T.gray, fontSize: 11, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ width: 160, height: 3, background: T.grayD, borderRadius: 99, overflow: "hidden", position: "relative", zIndex: 2 }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, background: T.green, borderRadius: 99, transition: "width 0.1s linear" }}/>
      </div>
      <p style={{ color: T.gray, fontSize: 12, position: "relative", zIndex: 2 }}>Loading results…</p>
    </div>
  );
}

function ProgressRing({ value, max = 100, size = 80, strokeWidth = 6, color = T.green, label, sublabel }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(value / max, 1));
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.grayD} strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)", filter: `drop-shadow(0 0 8px ${color}90)` }}/>
      </svg>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        {label && <div style={{ color, fontWeight: 900, fontSize: size > 90 ? 22 : 15, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{label}</div>}
        {sublabel && <div style={{ color: T.gray, fontSize: 9, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

function AnimNum({ value, suffix = "", decimals = 0 }) {
  const [disp, setDisp] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current, end = value, dur = 700;
    const t0 = performance.now();
    const tick = now => { const t = Math.min((now - t0) / dur, 1); const ease = 1 - Math.pow(1 - t, 3); setDisp(+(start + (end - start) * ease).toFixed(decimals)); if (t < 1) requestAnimationFrame(tick); else prev.current = end; };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{disp}{suffix}</>;
}

function Chart({ data, color = T.green, height = 120, label = "c", minVal, maxVal }) {
  const W = 340, H = height, pad = { t: 12, b: 28, l: 34, r: 10 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const mn = minVal ?? Math.min(...data) - 5, mx = maxVal ?? Math.max(...data) + 5;
  const pts = data.map((v, i) => ({ x: pad.l + (i / (data.length - 1)) * cw, y: pad.t + ch - ((v - mn) / (mx - mn)) * ch }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) { const cx = (pts[i-1].x + pts[i].x) / 2; d += ` C ${cx} ${pts[i-1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`; }
  const area = `${d} L ${pts[pts.length-1].x} ${pad.t+ch} L ${pts[0].x} ${pad.t+ch} Z`;
  const gid = `cg_${label}`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.32"/><stop offset="100%" stopColor={color} stopOpacity="0.01"/></linearGradient></defs>
      {[0,0.25,0.5,0.75,1].map((f, i) => { const y = pad.t + f * ch; const v = Math.round(mx - f * (mx - mn)); return <g key={i}><line x1={pad.l} y1={y} x2={W-pad.r} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/><text x={pad.l-4} y={y+4} textAnchor="end" fill={T.gray} fontSize="9" fontFamily={font}>{v}</text></g>; })}
      {pts.map((_, i) => { if (data.length > 8 && i % 3 !== 0) return null; return <text key={i} x={pts[i].x} y={H-3} textAnchor="middle" fill={T.gray} fontSize="9" fontFamily={font}>W{Math.ceil((i+1)*6/data.length)}</text>; })}
      <path d={area} fill={`url(#${gid})`}/>
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 5px ${color}70)` }}/>
      {pts.map((pt, i) => <g key={i}><circle cx={pt.x} cy={pt.y} r="4.5" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }}/><circle cx={pt.x} cy={pt.y} r="2" fill="white"/></g>)}
    </svg>
  );
}

function Card({ children, style = {}, glow = false, hover = false, onClick }) {
  return (
    <div onClick={onClick} className={hover ? "card-hover" : ""}
      style={{ background: T.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${glow ? T.greenBorder : T.glassBorder}`, borderRadius: 16, padding: 24, boxShadow: glow ? `0 0 28px ${T.greenGlow}, inset 0 1px 0 rgba(255,255,255,0.06)` : "inset 0 1px 0 rgba(255,255,255,0.04)", cursor: onClick ? "pointer" : "default", position: "relative", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style = {}, disabled = false, icon: IconCmp }) {
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, padding: "0 26px", borderRadius: 99, border: "none", fontFamily: font, fontWeight: 700, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)", letterSpacing: 0.2, whiteSpace: "nowrap" };
  const V = { primary: { background: `linear-gradient(135deg, ${T.green} 0%, ${T.greenDeep} 100%)`, color: "#fff", boxShadow: `0 4px 24px ${T.greenGlow}` }, secondary: { background: "transparent", color: T.green, border: `1.5px solid ${T.green}` }, ghost: { background: T.grayD, color: T.gray, border: `1px solid ${T.border}` }, danger: { background: `linear-gradient(135deg, ${T.red}, #8B0000)`, color: "#fff" } };
  return <button className="btn-press" style={{ ...base, ...V[variant], ...style }} onClick={onClick} disabled={disabled}>{IconCmp && <IconCmp size={18}/>}{children}</button>;
}

function Hero({ title, subtitle, right }) {
  return (
    <div style={{ background: "linear-gradient(180deg, #0D2818 0%, rgba(13,40,24,0.5) 60%, transparent 100%)", padding: "24px 20px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,83,0.2) 0%, transparent 70%)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", top: -10, right: 12, pointerEvents: "none" }}><ValorWatermark size={130}/></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        <div>
          <h1 style={{ fontSize: 25, fontWeight: 900, color: T.white, lineHeight: 1.15, letterSpacing: -0.5, margin: 0, fontFamily: font }}>{title}</h1>
          {subtitle && <p style={{ color: T.gray, fontSize: 13, marginTop: 5 }}>{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WEBCAM & POSE
═══════════════════════════════════════════════════════════════ */
function PoseCanvas({ kneeAngle }) {
  const ref = useRef(null), raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const draw = () => {
      const W = c.width, H = c.height; ctx.clearRect(0, 0, W, H);
      const lift = (kneeAngle / 130) * H * 0.10;
      const j = { head: {x:W*.5,y:H*.11}, neck: {x:W*.5,y:H*.22}, sL: {x:W*.36,y:H*.30}, sR: {x:W*.64,y:H*.30}, hipL: {x:W*.39,y:H*.50}, hipR: {x:W*.61,y:H*.50}, kneeL: {x:W*.37,y:H*.66-lift}, kneeR: {x:W*.63,y:H*.66-lift}, ankleL: {x:W*.35,y:H*.84}, ankleR: {x:W*.65,y:H*.84} };
      const bone = (a, b) => { const gr = ctx.createLinearGradient(a.x,a.y,b.x,b.y); gr.addColorStop(0,"rgba(0,200,83,0.75)"); gr.addColorStop(1,"rgba(0,200,83,0.55)"); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=gr; ctx.lineWidth=2.5; ctx.lineCap="round"; ctx.stroke(); };
      [["head","neck"],["neck","sL"],["neck","sR"],["sL","hipL"],["sR","hipR"],["hipL","hipR"],["hipL","kneeL"],["hipR","kneeR"],["kneeL","ankleL"],["kneeR","ankleR"]].forEach(([a,b])=>bone(j[a],j[b]));
      Object.entries(j).forEach(([k,pt]) => { const isKnee = k==="kneeL"||k==="kneeR"; if(isKnee){ctx.beginPath();ctx.arc(pt.x,pt.y,14,0,Math.PI*2);ctx.fillStyle="rgba(255,149,0,0.18)";ctx.fill();} const gr=ctx.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,10); gr.addColorStop(0,isKnee?"rgba(255,149,0,0.5)":"rgba(0,200,83,0.4)"); gr.addColorStop(1,"transparent"); ctx.beginPath();ctx.arc(pt.x,pt.y,10,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill(); ctx.beginPath();ctx.arc(pt.x,pt.y,isKnee?7:5.5,0,Math.PI*2);ctx.fillStyle=isKnee?"#FF9500":T.green;ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.6)";ctx.lineWidth=1.5;ctx.stroke(); });
      const kL=j.kneeL,hip=j.hipL,ank=j.ankleL; const a1=Math.atan2(hip.y-kL.y,hip.x-kL.x),a2=Math.atan2(ank.y-kL.y,ank.x-kL.x); ctx.beginPath();ctx.arc(kL.x,kL.y,24,a1,a2);ctx.strokeStyle="rgba(255,149,0,0.8)";ctx.lineWidth=2;ctx.stroke(); ctx.fillStyle="#FF9500";ctx.font="bold 11px Inter,sans-serif";ctx.fillText(`${kneeAngle}°`,kL.x+18,kL.y-12);
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [kneeAngle]);
  return <canvas ref={ref} width={420} height={360} style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }}/>;
}

function WebcamFeed({ kneeAngle }) {
  const vidRef = useRef(null); const [active,setActive]=useState(false); const [err,setErr]=useState(false);
  useEffect(() => { let stream; navigator.mediaDevices.getUserMedia({video:true}).then(s=>{stream=s;if(vidRef.current)vidRef.current.srcObject=s;setActive(true);}).catch(()=>setErr(true)); return ()=>stream?.getTracks().forEach(t=>t.stop()); },[]);
  return (
    <div style={{ position:"relative",width:"100%",height:360,borderRadius:20,overflow:"hidden",border:`1.5px solid ${T.greenBorder}`,boxShadow:`0 0 40px ${T.greenGlow}`,background:T.surface }}>
      {active?<video ref={vidRef} autoPlay playsInline muted style={{width:"100%",height:"100%",objectFit:"cover",transform:"scaleX(-1)"}}/>:<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}><div style={{padding:16,borderRadius:16,background:T.grayD,color:T.gray}}><Camera size={32}/></div><div style={{color:T.gray,fontSize:13,textAlign:"center"}}>{err?"Camera denied — simulation active":"Activating camera…"}</div></div>}
      <PoseCanvas kneeAngle={kneeAngle}/>
      <div style={{position:"absolute",top:14,right:14,display:"flex",alignItems:"center",gap:6,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(10px)",border:`1px solid ${T.greenBorder}`,borderRadius:99,padding:"5px 12px"}}><div className="live-pulse" style={{width:7,height:7,borderRadius:"50%",background:T.green}}/><span style={{color:T.white,fontSize:11,fontWeight:800,letterSpacing:1.5}}>LIVE</span></div>
    </div>
  );
}

function useMetrics(phase) {
  const [m,setM]=useState({knee:20,hip:15,sym:82,reps:0,t:0});
  const s=useRef({t:0,phase:"down",count:0,start:Date.now()});
  useEffect(()=>{const id=setInterval(()=>{s.current.t+=0.038;const tt=s.current.t,maxK=phase===2?118:98;const knee=Math.round(18+((Math.sin(tt)+1)/2)*(maxK-18));const hip=Math.round(10+((Math.sin(tt+0.3)+1)/2)*68);const sym=Math.round(83+Math.sin(tt*1.8)*7);const elapsed=Math.floor((Date.now()-s.current.start)/1000);if(knee>maxK*0.78&&s.current.phase==="down")s.current.phase="up";else if(knee<28&&s.current.phase==="up"){s.current.phase="down";s.current.count=Math.min(s.current.count+1,15);}setM({knee,hip,sym,reps:s.current.count,t:elapsed});},80);return()=>clearInterval(id);},[phase]);
  return m;
}

function HeatMap({ weeks=12 }) {
  const cells=useRef(Array.from({length:weeks*7},()=>{const r=Math.random();return r>0.35?(r>0.75?2:1):0;}));
  const colors=[T.grayD,`${T.greenDeep}99`,T.green];
  return <div style={{display:"flex",gap:4}}>{Array.from({length:weeks}).map((_,w)=><div key={w} style={{display:"flex",flexDirection:"column",gap:4}}>{Array.from({length:7}).map((_,d)=><div key={d} style={{width:12,height:12,borderRadius:3,background:colors[cells.current[w*7+d]],boxShadow:cells.current[w*7+d]===2?`0 0 4px ${T.green}70`:"none"}}/>)}</div>)}</div>;
}

/* ═══════════════════════════════════════════════════════════════
   PATIENT SCREENS
═══════════════════════════════════════════════════════════════ */
function PatientLogin({ onBegin }) {
  const [name, setName] = useState("Alex Johnson");
  const [phase, setPhase] = useState(1);
  return (
    <div className="fadeUp" style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden" }}>
      <AmbientBg/>
      <div style={{position:"absolute",top:"10%",left:"50%",transform:"translateX(-50%)",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle, rgba(0,200,83,0.1) 0%, transparent 65%)",pointerEvents:"none"}}/>
      <div className="fadeUp" style={{textAlign:"center",marginBottom:48,position:"relative",zIndex:1}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",opacity:0.06,pointerEvents:"none"}}><ValorIcon size={300}/></div>
        <div style={{position:"relative"}}><ValorLogo height={80} darkBg={true} /></div>
        <p style={{color:T.gray,fontSize:13,marginTop:6,letterSpacing:2,textTransform:"uppercase"}}>Clinical AI Motion Analysis</p>
      </div>
      <Card className="fadeUp2" style={{width:"100%",maxWidth:400,padding:32,position:"relative",zIndex:1}}>
        <div style={{marginBottom:22}}>
          <label style={{color:T.gray,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:10}}>Patient Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" style={{width:"100%",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 16px",color:T.white,fontSize:15,fontFamily:font}} onFocus={e=>e.target.style.borderColor=T.greenBorder} onBlur={e=>e.target.style.borderColor=T.border}/>
        </div>
        <div style={{marginBottom:32}}>
          <label style={{color:T.gray,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:10}}>Rehab Phase</label>
          <div style={{display:"flex",gap:10}}>
            {[{p:1,label:"Phase 1",sub:"Weeks 1–3"},{p:2,label:"Phase 2",sub:"Weeks 4–6"}].map(({p,label,sub})=>(
              <div key={p} onClick={()=>setPhase(p)} style={{flex:1,padding:"16px 12px",textAlign:"center",borderRadius:12,border:`1.5px solid ${phase===p?T.green:T.border}`,background:phase===p?T.greenDim:"transparent",cursor:"pointer",transition:"all 0.2s",boxShadow:phase===p?`0 0 18px ${T.greenGlow}`:"none"}}>
                <div style={{color:phase===p?T.green:T.gray,fontWeight:800,fontSize:14,fontFamily:font}}>{label}</div>
                <div style={{color:T.gray,fontSize:11,marginTop:3}}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
        <Btn onClick={()=>name&&onBegin({name,phase})} style={{width:"100%",fontSize:16}} icon={ArrowRight}>Begin Session</Btn>
      </Card>
      <p className="fadeUp3" style={{color:"#2A2A2A",fontSize:12,marginTop:28,position:"relative",zIndex:1}}>ValorPT v2.1 · HIPAA Compliant · SOC 2 Type II</p>
    </div>
  );
}

function ProgramDashboard({ patient, onStartSession, onViewDetail }) {
  const exercises = patient.phase === 1 ? PHASE1_EXERCISES : PHASE2_EXERCISES;
  const done = exercises.filter(e => e.done).length;
  const nextIdx = exercises.findIndex(e => !e.done);
  return (
    <div className="fadeUp" style={{ minHeight:"100vh",background:T.bg,color:T.white,paddingBottom:90 }}>
      <Hero title="ACL Rehabilitation" subtitle={`${patient.name} · Phase ${patient.phase}`} right={<ProgressRing value={patient.week} max={6} size={62} strokeWidth={5} label={`W${patient.week}`} sublabel="of 6"/>}/>
      <div className="fadeUp2" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,padding:"16px 16px 0"}}>
        {[{label:"Current Phase",val:patient.phase,sub:patient.phase===1?"ROM & Quad":"Strength",color:T.green,Icon:Layers},{label:"Sessions/Week",val:4,sub:"Target: 5",color:T.green,Icon:Calendar},{label:"Avg Flexion",val:"94°",sub:"↑ 6° this week",color:T.orange,Icon:TrendingUp}].map(s=>(
          <div key={s.label} style={{background:T.glass,backdropFilter:"blur(20px)",border:`1px solid ${T.glassBorder}`,borderRadius:14,padding:"14px 10px",textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:6,color:s.color}}><s.Icon size={16}/></div>
            <div style={{color:s.color,fontSize:26,fontWeight:900,fontVariantNumeric:"tabular-nums",lineHeight:1}}>{s.val}</div>
            <div style={{color:T.gray,fontSize:10,marginTop:4,textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>{s.label}</div>
            <div style={{color:"#555",fontSize:10,marginTop:2}}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="fadeUp3" style={{padding:"14px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
          <span style={{color:T.gray,fontSize:12,fontWeight:600}}>Today's Progress</span>
          <span style={{color:T.green,fontSize:12,fontWeight:800}}>{done}/{exercises.length} exercises</span>
        </div>
        <div style={{height:5,background:T.grayD,borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(done/exercises.length)*100}%`,background:`linear-gradient(90deg, ${T.greenDeep}, ${T.green})`,borderRadius:99,boxShadow:`0 0 10px ${T.green}80`,transition:"width 1.2s cubic-bezier(0.16,1,0.3,1)"}}/>
        </div>
      </div>
      <div className="fadeUp4" style={{padding:"18px 16px 0"}}>
        <div style={{color:T.gray,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>
          Phase {patient.phase} — {patient.phase===1?"ROM & Quad Activation":"Strength & Functional Control"}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {exercises.map((ex, i) => {
            const isToday = i === nextIdx;
            const statusColor = ex.done ? T.green : isToday ? T.orange : T.grayD;
            return (
              <div key={ex.id} className="card-hover"
                onClick={() => onViewDetail(ex)}
                style={{background:T.glass,backdropFilter:"blur(20px)",border:`1px solid ${ex.done?"rgba(0,200,83,0.2)":isToday?"rgba(255,149,0,0.25)":T.glassBorder}`,borderRadius:14,overflow:"hidden",cursor:"pointer",display:"flex",alignItems:"stretch"}}>
                <div style={{width:4,flexShrink:0,background:statusColor,boxShadow:ex.done?`0 0 8px ${T.green}80`:isToday?"0 0 8px rgba(255,149,0,0.6)":"none"}}/>
                <div style={{width:50,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:ex.done?T.green:isToday?T.orange:T.gray}}>
                  <ex.Icon size={20}/>
                </div>
                <div style={{flex:1,padding:"13px 0",minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:14,color:ex.done?T.gray:T.white}}>{ex.name}</div>
                  <div style={{color:T.gray,fontSize:12,marginTop:2}}>{ex.sets} · {ex.metric}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"0 14px 0 8px"}}>
                  {ex.done&&<span style={{background:T.greenDim,color:T.green,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:99,display:"flex",alignItems:"center",gap:3}}><Check size={10}/>Done</span>}
                  {isToday&&<span style={{background:"rgba(255,149,0,0.12)",color:T.orange,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:99}}>Next</span>}
                  <ChevronRight size={16} color={T.gray}/>
                </div>
              </div>
            );
          })}
        </div>
        <Btn onClick={()=>onViewDetail(exercises[nextIdx>=0?nextIdx:0])} style={{width:"100%",marginTop:20,fontSize:16}} icon={Play}>
          Start Today's Session
        </Btn>
      </div>
    </div>
  );
}

function ExerciseSession({ patient, exercise, onComplete, onBack }) {
  const m = useMetrics(patient.phase);
  const [sets, setSets] = useState(0);
  const totalSets = 3;
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const INSTRS = { "Lying Heel Slides":"Lie flat. Slowly slide heel toward buttocks as far as comfortable. Hold 2s, return slowly.","Seated Heel Slides":"Sit in chair. Slide heel under chair bending knee maximally. Hold 2s at peak.","Straight Leg Raises":"Tighten quad, raise leg to 45°. Hold 2s. Lower slowly with full control.","Long Arc Quad":"Sit at surface edge. Fully straighten leg, hold 5s, lower slowly.","Air Squats (60°)":"Stand shoulder-width. Lower to 60° knee flexion. Control descent and ascent.","Air Squats (30°)":"Stand shoulder-width. Lower to 30° knee flexion only. Focus on symmetry.","Single Leg Squat 50%":"Stand on operative leg. Lower to half squat, knee over 2nd toe.","Single Leg Squat Max":"Stand on operative leg. Lower as deep as comfortable maintaining alignment.","Step-Ups":"Step up leading with operative leg. Straighten fully at top.","Forward Lunges":"Step forward, lower back knee toward floor. Drive through heel back to start." };
  const instr = INSTRS[exercise?.name] || "Perform movement slowly and with full control.";
  return (
    <div className="fadeUp" style={{minHeight:"100vh",background:T.bg,color:T.white,paddingBottom:90}}>
      <div style={{background:"linear-gradient(180deg, #0D2818 0%, transparent 100%)",padding:"14px 18px",display:"flex",alignItems:"center",gap:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:140,height:140,borderRadius:"50%",background:"radial-gradient(circle, rgba(0,200,83,0.2) 0%, transparent 70%)",pointerEvents:"none"}}/>
        <button onClick={onBack} className="btn-press" style={{background:T.grayD,border:`1px solid ${T.border}`,borderRadius:99,padding:"8px 12px",color:T.gray,cursor:"pointer",display:"flex",alignItems:"center"}}><ChevronLeft size={18}/></button>
        <div style={{flex:1,position:"relative"}}>
          <div style={{fontWeight:800,fontSize:16,letterSpacing:-0.3}}>{exercise?.name}</div>
          <div style={{color:T.green,fontSize:12,marginTop:1}}>Phase {patient.phase} · Set {sets+1} of {totalSets}</div>
        </div>
        <div style={{background:T.grayD,border:`1px solid ${T.border}`,borderRadius:12,padding:"8px 14px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <Timer size={12} color={T.gray}/>
          <div style={{color:T.green,fontWeight:900,fontSize:18,fontVariantNumeric:"tabular-nums"}}>{fmt(m.t)}</div>
        </div>
      </div>
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>
        <WebcamFeed kneeAngle={m.knee}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{label:"Knee Flexion",val:m.knee,unit:"°",color:T.orange,Icon:Bone},{label:"Hip Flexion",val:m.hip,unit:"°",color:T.green,Icon:Activity},{label:"Symmetry",val:m.sym,unit:"%",color:m.sym>=80?T.green:T.red,Icon:Target},{label:"Reps",val:m.reps,unit:"",color:T.white,Icon:Zap}].map(mc=>(
            <Card key={mc.label} style={{padding:"14px 16px",textAlign:"center"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:5,color:T.gray}}><mc.Icon size={13}/><span style={{color:T.gray,fontSize:11,textTransform:"uppercase",letterSpacing:0.8,fontWeight:600}}>{mc.label}</span></div>
              <div style={{color:mc.color,fontSize:42,fontWeight:900,fontVariantNumeric:"tabular-nums",lineHeight:1,letterSpacing:-1}}><AnimNum value={mc.val} suffix={mc.unit}/></div>
            </Card>
          ))}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>{Array.from({length:totalSets}).map((_,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:i<=sets?T.green:T.grayD,boxShadow:i<=sets?`0 0 6px ${T.green}`:"none"}}/>)}</div>
        <Card style={{padding:"14px 18px"}}><div style={{display:"flex",gap:10,alignItems:"flex-start"}}><Info size={16} color={T.green} style={{flexShrink:0,marginTop:1}}/><p style={{color:T.gray,fontSize:13,lineHeight:1.6}}>{instr}</p></div></Card>
        <Btn onClick={()=>{if(sets<totalSets-1)setSets(s=>s+1);else onComplete({m,exercise});}} style={{width:"100%",fontSize:16}} icon={sets<totalSets-1?Check:ArrowRight}>
          {sets<totalSets-1?`Complete Set ${sets+1}`:"Finish Exercise"}
        </Btn>
      </div>
    </div>
  );
}

function SessionResults({ result, onNext, onEnd, onViewReport }) {
  const repData=[22,44,72,90,100,107,104,102,108,106,104,108,107,108,108];
  const W=340,H=100,pad={t:8,b:16,l:24,r:8},cw=W-pad.l-pad.r,ch=H-pad.t-pad.b,mn=0,mx=130;
  const pts=repData.map((v,i)=>({x:pad.l+(i/(repData.length-1))*cw,y:pad.t+ch-((v-mn)/(mx-mn))*ch}));
  let d=`M ${pts[0].x} ${pts[0].y}`;for(let i=1;i<pts.length;i++){const cx=(pts[i-1].x+pts[i].x)/2;d+=` C ${cx} ${pts[i-1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;}
  const area=`${d} L ${pts[pts.length-1].x} ${pad.t+ch} L ${pts[0].x} ${pad.t+ch} Z`;
  return (
    <div className="fadeUp" style={{minHeight:"100vh",background:T.bg,color:T.white,paddingBottom:90}}>
      <div style={{background:"linear-gradient(135deg, #0D2818, rgba(27,94,32,0.6), #0A0A0A)",padding:"40px 24px 32px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle, rgba(0,200,83,0.14) 0%, transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.08,pointerEvents:"none"}}><ValorIcon size={220}/></div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16,position:"relative"}}><ValorLogo height={48} darkBg={true} /></div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14,position:"relative"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:T.greenDim,border:`1px solid ${T.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 24px ${T.greenGlow}`}}><CheckCircle size={36} color={T.green}/></div>
        </div>
        <h2 style={{fontFamily:font,fontWeight:900,fontSize:28,letterSpacing:-0.5,margin:"0 0 6px",position:"relative"}}>Exercise Complete!</h2>
        <p style={{color:T.gray,fontSize:14,position:"relative"}}>{result?.exercise?.name}</p>
      </div>
      <div style={{padding:"20px 16px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {[{label:"Peak Flexion",val:"108°",trend:"↑ 6°",Icon:TrendingUp},{label:"Avg Symmetry",val:"87%",trend:"↑ 3%",Icon:Target},{label:"Reps",val:"15",trend:"Goal",Icon:CheckCircle}].map(k=>(
            <Card key={k.label} style={{padding:"16px 10px",textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:6,color:T.green}}><k.Icon size={16}/></div>
              <div style={{color:T.gray,fontSize:10,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{k.label}</div>
              <div style={{color:T.green,fontSize:24,fontWeight:900}}>{k.val}</div>
              <div style={{color:T.green,fontSize:10,marginTop:5,fontWeight:700}}>{k.trend}</div>
            </Card>
          ))}
        </div>
        <Card>
          <div style={{color:T.gray,fontSize:11,textTransform:"uppercase",letterSpacing:0.8,marginBottom:10,fontWeight:600}}>Knee Flexion by Rep</div>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`}><defs><linearGradient id="repG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.green} stopOpacity="0.35"/><stop offset="100%" stopColor={T.green} stopOpacity="0.01"/></linearGradient></defs><path d={area} fill="url(#repG)"/><path d={d} fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{filter:`drop-shadow(0 0 4px ${T.green}60)`}}/></svg>
        </Card>
        <Card glow><div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{padding:10,borderRadius:12,background:T.greenDim,border:`1px solid ${T.greenBorder}`,flexShrink:0}}><TrendingUp size={24} color={T.green}/></div><div><div style={{fontWeight:800,color:T.green,fontSize:15}}>Great progress!</div><div style={{color:T.gray,fontSize:13,marginTop:4,lineHeight:1.5}}>Peak flexion improved 6° vs last session. On track for 120° by Week 6.</div></div></div></Card>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={onNext} style={{flex:2}} icon={ArrowRight}>Next Exercise</Btn>
          <Btn onClick={onEnd} variant="secondary" style={{flex:1}}>End Session</Btn>
        </div>
        <Btn onClick={onViewReport} variant="ghost" style={{width:"100%"}} icon={FileText}>View Full Session Report</Btn>
      </div>
    </div>
  );
}

// ProgressDashboard is now imported from components/ProgressDashboard.jsx

/* ═══════════════════════════════════════════════════════════════
   CLINICIAN SCREENS
═══════════════════════════════════════════════════════════════ */
function ClinicianDashboard({ onSelectPatient }) {
  const [search, setSearch] = useState("");
  const filtered = CLINICIAN_PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fadeUp" style={{minHeight:"100vh",background:T.bg,color:T.white}}>
      <Hero title="Patient Overview" subtitle={`${CLINICIAN_PATIENTS.length} active · ${CLINICIAN_PATIENTS.filter(p=>p.flagged).length} flagged`} right={<Btn variant="secondary" style={{padding:"10px 16px",fontSize:13,minHeight:40}} icon={Plus}>Add</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,padding:"14px 16px 0"}}>{[{label:"Patients",val:4,color:T.green,Icon:Users},{label:"Compliance",val:"78%",color:T.orange,Icon:BarChart2},{label:"Flagged",val:2,color:T.red,Icon:AlertTriangle}].map(k=><Card key={k.label} style={{padding:"14px 10px",textAlign:"center"}}><div style={{display:"flex",justifyContent:"center",marginBottom:6,color:k.color}}><k.Icon size={18}/></div><div style={{color:k.color,fontSize:28,fontWeight:900}}>{k.val}</div><div style={{color:T.gray,fontSize:10,marginTop:3,textTransform:"uppercase",letterSpacing:0.5}}>{k.label}</div></Card>)}</div>
      <div style={{padding:"14px 16px"}}>
        <div style={{position:"relative",marginBottom:14}}><div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.gray}}><Search size={16}/></div><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patients…" style={{width:"100%",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 14px 12px 40px",color:T.white,fontSize:14,fontFamily:font}}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(p=>(
            <div key={p.id} className="card-hover" onClick={()=>onSelectPatient(p)} style={{background:T.glass,backdropFilter:"blur(20px)",border:`1px solid ${p.flagged?"rgba(255,59,48,0.3)":T.glassBorder}`,borderRadius:16,padding:"18px",cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:46,height:46,borderRadius:"50%",background:`linear-gradient(135deg, ${T.greenDeep}, ${T.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:17,color:T.white,flexShrink:0,boxShadow:`0 0 14px ${T.greenGlow}`}}>{p.name.split(" ").map(w=>w[0]).join("")}</div>
                <div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:800,fontSize:15}}>{p.name}</span>{p.flagged&&<Flag size={14} color={T.red}/>}</div><div style={{color:T.gray,fontSize:12,marginTop:2}}>Phase {p.phase} · Week {p.week} · Last: {p.lastSession}</div></div>
                <div style={{textAlign:"right",flexShrink:0}}><div style={{color:p.compliance>=80?T.green:p.compliance>=65?T.orange:T.red,fontWeight:900,fontSize:20}}>{p.compliance}%</div><div style={{color:T.gray,fontSize:10}}>compliance</div></div>
              </div>
              <div style={{marginTop:12,height:4,background:T.grayD,borderRadius:99}}><div style={{height:"100%",borderRadius:99,width:`${p.compliance}%`,background:p.compliance>=80?`linear-gradient(90deg, ${T.greenDeep}, ${T.green})`:p.compliance>=65?`linear-gradient(90deg, #E65100, ${T.orange})`:`linear-gradient(90deg, #8B0000, ${T.red})`,boxShadow:`0 0 8px ${p.compliance>=80?T.green:p.compliance>=65?T.orange:T.red}50`,transition:"width 1s cubic-bezier(0.16,1,0.3,1)"}}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClinicianPatientView({ patient, onBack }) {
  const alerts=patient.flagged?["Knee flexion plateaued for 5 consecutive days","Missed 2 consecutive sessions"]:[];
  const breakdown=[{name:"Lying Heel Slides",done:9,total:12,metric:"88°",warn:false},{name:"Seated Heel Slides",done:11,total:12,metric:"82°",warn:false},{name:"Straight Leg Raises",done:10,total:12,metric:"84%",warn:false},{name:"Long Arc Quad",done:8,total:12,metric:"79°",warn:true}];
  return (
    <div className="fadeUp" style={{minHeight:"100vh",background:T.bg,color:T.white,paddingBottom:40}}>
      <div style={{background:"linear-gradient(180deg, #0D2818 0%, transparent 100%)",padding:"14px 18px",display:"flex",alignItems:"center",gap:14,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle, rgba(0,200,83,0.18) 0%, transparent 70%)",pointerEvents:"none"}}/>
        <button onClick={onBack} className="btn-press" style={{background:T.grayD,border:`1px solid ${T.border}`,borderRadius:99,padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center"}}><ChevronLeft size={18} color={T.gray}/></button>
        <span style={{fontWeight:800,fontSize:17}}>Patient Report</span>
      </div>
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>
        <Card><div style={{display:"flex",gap:14,alignItems:"center"}}><div style={{width:60,height:60,borderRadius:18,background:`linear-gradient(135deg, ${T.greenDeep}, ${T.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:22,color:T.white,flexShrink:0,boxShadow:`0 0 20px ${T.greenGlow}`}}>{patient.name.split(" ").map(w=>w[0]).join("")}</div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontWeight:900,fontSize:19}}>{patient.name}</span>{patient.flagged&&<Flag size={15} color={T.red}/>}</div><div style={{color:T.green,fontSize:13,fontWeight:600}}>Phase {patient.phase} · Week {patient.week}</div><div style={{color:T.gray,fontSize:12,marginTop:1}}>Surgery: 2026-04-01</div></div><ProgressRing value={patient.compliance} max={100} size={68} label={`${patient.compliance}%`} sublabel="comply" color={patient.compliance>=80?T.green:T.orange}/></div></Card>
        {alerts.length>0&&<Card style={{border:`1px solid rgba(255,59,48,0.4)`,background:"rgba(255,59,48,0.06)"}}><div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}><AlertTriangle size={18} color={T.red}/><span style={{color:T.red,fontWeight:800,fontSize:14}}>Clinical Alerts</span></div>{alerts.map((a,i)=><div key={i} style={{color:"#FFCDD2",fontSize:13,padding:"7px 0",borderTop:i>0?"1px solid rgba(255,59,48,0.15)":"none",lineHeight:1.5}}>• {a}</div>)}</Card>}
        <Card><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div><div style={{color:T.gray,fontSize:11,textTransform:"uppercase",letterSpacing:0.8,fontWeight:600}}>Knee Flexion ROM</div><div style={{color:T.white,fontSize:26,fontWeight:900,marginTop:4}}>{ROM_DATA[Math.min(patient.week*2-1,ROM_DATA.length-1)]}°</div></div><span style={{color:T.green,fontSize:12,fontWeight:700,background:T.greenDim,padding:"4px 10px",borderRadius:99,display:"flex",alignItems:"center",gap:4}}><TrendingUp size={12}/>trending</span></div><Chart data={ROM_DATA.slice(0,Math.min(patient.week*2,ROM_DATA.length))} label={`rom${patient.id}`} minVal={55} maxVal={125} height={120}/></Card>
        <Card><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div><div style={{color:T.gray,fontSize:11,textTransform:"uppercase",letterSpacing:0.8,fontWeight:600}}>Symmetry Score</div><div style={{color:T.white,fontSize:26,fontWeight:900,marginTop:4}}>{SYM_DATA[Math.min(patient.week*2-1,SYM_DATA.length-1)]}%</div></div><span style={{color:patient.flagged?T.orange:T.green,fontSize:12,fontWeight:700,background:patient.flagged?"rgba(255,149,0,0.12)":T.greenDim,padding:"4px 10px",borderRadius:99,display:"flex",alignItems:"center",gap:4}}>{patient.flagged?<><AlertTriangle size={12}/>monitor</>:<><TrendingUp size={12}/>trending</>}</span></div><Chart data={SYM_DATA.slice(0,Math.min(patient.week*2,SYM_DATA.length))} label={`sym${patient.id}`} minVal={65} maxVal={100} height={100} color={T.orange}/></Card>
        <Card><div style={{color:T.gray,fontSize:11,textTransform:"uppercase",letterSpacing:0.8,marginBottom:12,fontWeight:600}}>Session Compliance</div><div style={{overflowX:"auto",paddingBottom:4}}><HeatMap weeks={12}/></div><div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}><span style={{color:T.gray,fontSize:10}}>Less</span>{[T.grayD,`${T.greenDeep}99`,T.green].map((c,i)=><div key={i} style={{width:12,height:12,borderRadius:3,background:c}}/>)}<span style={{color:T.gray,fontSize:10}}>More</span></div></Card>
        <Card><div style={{color:T.gray,fontSize:11,textTransform:"uppercase",letterSpacing:0.8,marginBottom:12,fontWeight:600}}>Exercise Breakdown</div>{breakdown.map((r,i)=><div key={r.name} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<breakdown.length-1?`1px solid ${T.border}`:"none"}}><div style={{flexShrink:0}}>{r.warn?<AlertTriangle size={14} color={T.orange}/>:<CheckCircle size={14} color={T.green}/>}</div><div style={{flex:1,fontSize:13,color:T.white,fontWeight:500}}>{r.name}</div><div style={{fontSize:13}}><span style={{color:T.green,fontWeight:700}}>{r.done}</span><span style={{color:T.gray}}>/{r.total}</span></div><div style={{color:T.green,fontWeight:800,fontSize:14,minWidth:36,textAlign:"right"}}>{r.metric}</div></div>)}</Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════════ */
function BottomNav({ active, onNav }) {
  const tabs=[{id:"home",Icon:Home,label:"Home"},{id:"program",Icon:ClipboardList,label:"Program"},{id:"record",Icon:Circle,label:"Record"},{id:"progress",Icon:TrendingUp,label:"Progress"},{id:"profile",Icon:User,label:"Profile"}];
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(8,8,8,0.96)",backdropFilter:"blur(24px)",borderTop:`1px solid ${T.border}`,display:"flex",padding:"10px 0 14px",zIndex:200}}>
      {tabs.map(({id,Icon:IconCmp,label})=>{const isActive=active===id;return(<button key={id} onClick={()=>onNav(id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{padding:"6px 14px",borderRadius:99,background:isActive?T.greenDim:"transparent",boxShadow:isActive?`0 0 14px ${T.greenGlow}`:"none",transition:"all 0.25s",color:isActive?T.green:T.gray}}><IconCmp size={20}/></div><span style={{fontSize:10,color:isActive?T.green:T.gray,fontWeight:isActive?700:400,fontFamily:font}}>{label}</span></button>);})}
    </div>
  );
}

function TopNav({ active, onNav }) {
  const tabs=[{id:"patients",Icon:Users,label:"Patients"},{id:"analytics",Icon:BarChart2,label:"Analytics"},{id:"messages",Icon:MessageSquare,label:"Messages"},{id:"settings",Icon:Settings,label:"Settings"}];
  return (
    <div style={{background:"rgba(8,8,8,0.96)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 16px",position:"sticky",top:0,zIndex:100}}>
      <div style={{padding:"10px 14px 10px 0",marginRight:4,display:"flex",alignItems:"center"}}><ValorLogo height={32} darkBg={true} /></div>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>{tabs.map(({id,Icon:IconCmp,label})=>{const isActive=active===id;return(<button key={id} onClick={()=>onNav(id)} style={{background:"none",border:"none",padding:"14px 10px",display:"flex",alignItems:"center",gap:5,color:isActive?T.green:T.gray,fontWeight:isActive?700:400,fontSize:12,cursor:"pointer",fontFamily:font,borderBottom:isActive?`2px solid ${T.green}`:"2px solid transparent",transition:"all 0.2s",whiteSpace:"nowrap"}}><IconCmp size={14}/>{label}</button>);})}</div>
      <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg, ${T.greenDeep}, ${T.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:T.white,flexShrink:0}}>DR</div>
    </div>
  );
}

function ModeToggle({ mode, setMode }) {
  return (
    <div style={{position:"fixed",top:14,right:14,zIndex:300,display:"flex",background:"rgba(8,8,8,0.88)",backdropFilter:"blur(16px)",border:`1px solid ${T.border}`,borderRadius:99,overflow:"hidden",padding:3}}>
      {[{m:"patient",Icon:User,label:"Patient"},{m:"clinician",Icon:Stethoscope,label:"Clinician"}].map(({m,Icon:IconCmp,label})=>(
        <button key={m} onClick={()=>setMode(m)} className="btn-press" style={{padding:"6px 12px",border:"none",cursor:"pointer",borderRadius:99,background:mode===m?`linear-gradient(135deg, ${T.greenDeep}, ${T.green})`:"transparent",color:mode===m?T.white:T.gray,fontWeight:mode===m?700:400,fontSize:11,fontFamily:font,transition:"all 0.25s",boxShadow:mode===m?`0 0 14px ${T.greenGlow}`:"none",display:"flex",alignItems:"center",gap:5}}>
          <IconCmp size={13}/>{label}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function ValorPT() {
  const [splashDone, setSplashDone] = useState(false);
  const [mode, setMode] = useState("patient");
  const [screen, setScreen] = useState("login");
  const [clinicScreen, setClinicScreen] = useState("dashboard");
  const [patient, setPatient] = useState({ ...SAMPLE_PATIENT });
  const [exercise, setExercise] = useState(null);
  const [detailExercise, setDetailExercise] = useState(null);
  const [result, setResult] = useState(null);
  const [selPatient, setSelPatient] = useState(null);
  const [nav, setNav] = useState("home");
  const [clinicNav, setClinicNav] = useState("patients");
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleNav = (tab) => {
    setNav(tab);
    setDetailExercise(null);
    if (tab === "home" || tab === "program") setScreen("dashboard");
    if (tab === "record") setScreen("session");
    if (tab === "progress") setScreen("progress");
  };

  const handleViewDetail = (ex) => {
    setDetailExercise(ex);
  };

  const handleStartRecording = (ex) => {
    setExercise(ex);
    setDetailExercise(null);
    setScreen("session");
  };

  const renderPatient = () => {
    // Detail page takes priority over other screens
    if (detailExercise && screen !== "session" && screen !== "results") {
      return (
        <ExerciseDetailPage
          exercise={detailExercise}
          onBack={() => setDetailExercise(null)}
          onStartRecording={handleStartRecording}
        />
      );
    }
    switch (screen) {
      case "login":    return <PatientLogin onBegin={p => { setPatient({ ...SAMPLE_PATIENT, ...p }); setScreen("dashboard"); }}/>;
      case "dashboard":return <ProgramDashboard patient={patient} onStartSession={ex => { setExercise(ex); setScreen("session"); }} onViewDetail={handleViewDetail}/>;
      case "session":  return <ExerciseSession patient={patient} exercise={exercise} onComplete={r => { setResult(r); setShowCelebration(true); }} onBack={() => setScreen("dashboard")}/>;
      case "results":  return <SessionResults result={result} onNext={() => setScreen("dashboard")} onEnd={() => setScreen("dashboard")} onViewReport={() => setShowReport(true)}/>;
      case "progress": return <ProgressDashboard patient={patient} onViewReport={() => setShowReport(true)}/>;
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
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)}/>}
      <div style={{ fontFamily: font, background: T.bg, minHeight: "100vh", color: T.white, maxWidth: 480, margin: "0 auto", position: "relative", boxShadow: "0 0 100px rgba(0,0,0,0.9)", overflow: "hidden" }}>
        <AmbientBg/>
        {showCelebration && <CelebrationScreen exercise={exercise} onDone={() => { setShowCelebration(false); setShowDebrief(true); }}/>}
        {showDebrief && <AICoachDebrief patient={patient} result={result} onDone={() => { setShowDebrief(false); setScreen("results"); }}/>}
        {showReport && <SessionReport patient={patient} exercise={exercise} onBack={() => setShowReport(false)} />}
        <ModeToggle mode={mode} setMode={setMode}/>
        <div style={{ position: "relative", zIndex: 1 }}>
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
      </div>
    </>
  );
}
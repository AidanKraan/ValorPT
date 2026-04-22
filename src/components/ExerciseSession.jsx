import { useState, useEffect, useRef } from "react";
import { X, Settings, Check } from "lucide-react";

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

const SESSION_CSS = `
  @keyframes recPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.35); opacity: 0.55; }
  }
  @keyframes recHalo {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50%       { transform: scale(1.7); opacity: 0; }
  }
  @keyframes countdownPop {
    0%   { transform: scale(0.5); opacity: 0; }
    40%  { transform: scale(1.15); opacity: 1; }
    70%  { transform: scale(0.95); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes countdownFade {
    0%   { opacity: 1; }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes greenFlash {
    0%   { opacity: 0; }
    20%  { opacity: 0.7; }
    100% { opacity: 0; }
  }
  @keyframes checkmarkDraw {
    0%   { stroke-dashoffset: 120; opacity: 0; }
    20%  { opacity: 1; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }
  @keyframes slideUp {
    from { transform: translateY(40px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  /* Mesh figure animations — reused from ExerciseFigure */
  @keyframes breathe        { 0%,100%{transform:scale(1)} 50%{transform:scale(1.018)} }
  @keyframes muscleGlow     { 0%,100%{opacity:0.7} 50%{opacity:1} }
  @keyframes heelSlide      { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-22px)} }
  @keyframes stepUp         { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes squatDown      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
  @keyframes wobble         { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(0.8deg)} 75%{transform:rotate(-0.8deg)} }
  @keyframes kneeExtend     { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-18deg)} }
  @keyframes lunge-osc      { 0%,100%{transform:translateX(0)} 50%{transform:translateX(3px)} }
  @keyframes glowPulseGreen { 0%,100%{filter:drop-shadow(0 0 8px #00C853)} 50%{filter:drop-shadow(0 0 14px #00C853)} }
  @keyframes scanline       { 0%{top:-4px;opacity:0} 5%{opacity:0.04} 95%{opacity:0.04} 100%{top:100%;opacity:0} }
`;

/* ─── Coaching cues per exercise ─── */
const CUES = {
  "Lying Heel Slides":    "Slide heel slowly — don't rotate your hip",
  "Seated Heel Slides":   "Pull heel back under chair as far as comfortable",
  "Straight Leg Raises":  "Keep your knee fully locked — squeeze the quad",
  "Long Arc Quad":        "Straighten fully, hold 3 seconds at the top",
  "Air Squats (60°)":     "Keep your knees tracking over your toes",
  "Air Squats (30°)":     "Focus on equal weight — left and right balanced",
  "Single Leg Squat 50%": "Knee over 2nd toe — don't let it cave inward",
  "Single Leg Squat Max": "Control the descent, drive through your heel up",
  "Step-Ups":             "Full extension at the top — stand tall",
  "Forward Lunges":       "Keep your front knee aligned with your foot",
};

/* ─── Compact mesh demo figures (no full-screen scaffold) ─── */
function DemoFigure({ exerciseName }) {
  const name = exerciseName || "";

  if (name.includes("Heel Slides") && name.includes("Lying")) {
    return (
      <svg viewBox="0 0 400 200" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
        <defs>
          <radialGradient id="ds_ham" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="80" y="90" width="120" height="28" rx="13" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
        <ellipse cx="68" cy="104" rx="16" ry="14" fill="none" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
        <path d="M 200 98 L 285 100" stroke="rgba(120,200,255,0.28)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 285 100 L 355 98" stroke="rgba(120,200,255,0.25)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="285" cy="100" r="5" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
        <g style={{ animation: "heelSlide 2.4s ease-in-out infinite" }}>
          <path d="M 200 111 L 265 116" stroke="rgba(120,200,255,0.28)" strokeWidth="7" strokeLinecap="round" fill="none" />
          <ellipse cx="235" cy="114" rx="33" ry="10" fill="url(#ds_ham)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
          <circle cx="265" cy="116" r="6" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
          <path d="M 265 116 Q 280 132 294 150" stroke="rgba(120,200,255,0.28)" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
        <line x1="50" y1="165" x2="380" y2="165" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="6 5" />
      </svg>
    );
  }

  if (name.includes("Heel Slides") && name.includes("Seated")) {
    return (
      <svg viewBox="0 0 280 290" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
        <defs>
          <radialGradient id="ds2_ham" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="70" y="138" width="120" height="10" rx="3" fill="none" stroke="rgba(120,200,255,0.2)" strokeWidth="0.8" />
        <rect x="100" y="64" width="64" height="76" rx="12" fill="none" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
        <ellipse cx="132" cy="46" rx="16" ry="18" fill="none" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
        <path d="M 102 148 L 148 148" stroke="rgba(120,200,255,0.25)" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 148 148 L 148 225" stroke="rgba(120,200,255,0.22)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <g style={{ animation: "heelSlide 2.4s ease-in-out infinite" }}>
          <ellipse cx="152" cy="148" rx="28" ry="9" fill="url(#ds2_ham)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
          <path d="M 116 150 L 168 150" stroke="rgba(120,200,255,0.25)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 168 150 Q 164 185 158 222" stroke="rgba(120,200,255,0.22)" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
        <line x1="50" y1="230" x2="230" y2="230" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="6 5" />
      </svg>
    );
  }

  if (name.includes("Straight Leg")) {
    return (
      <svg viewBox="0 0 380 220" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
        <defs>
          <radialGradient id="ds3_q" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="78" y="96" width="120" height="26" rx="12" fill="none" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
        <ellipse cx="66" cy="109" rx="16" ry="14" fill="none" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
        <path d="M 198 108 L 262 110" stroke="rgba(120,200,255,0.22)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 262 110 Q 271 135 270 162" stroke="rgba(120,200,255,0.22)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <g style={{ animation: "stepUp 2.8s ease-in-out infinite", transformOrigin: "200px 118px" }}>
          <ellipse cx="248" cy="88" rx="48" ry="11" transform="rotate(-22 248 88)" fill="url(#ds3_q)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />
          <path d="M 200 118 L 276 70" stroke="rgba(120,200,255,0.32)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="276" cy="70" r="6" fill="rgba(0,200,83,0.15)" stroke="rgba(0,200,83,0.5)" strokeWidth="1" />
          <path d="M 276 70 L 340 44" stroke="rgba(120,200,255,0.28)" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
        <line x1="50" y1="172" x2="370" y2="172" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="6 5" />
      </svg>
    );
  }

  if (name.includes("Long Arc")) {
    return (
      <svg viewBox="0 0 280 290" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
        <defs>
          <radialGradient id="ds4_q" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="60" y="138" width="170" height="9" rx="3" fill="none" stroke="rgba(120,200,255,0.2)" strokeWidth="0.8" />
        <rect x="100" y="46" width="64" height="94" rx="12" fill="none" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
        <ellipse cx="132" cy="28" rx="16" ry="18" fill="none" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
        <path d="M 110" y1="142" x2="110" y2="220" stroke="rgba(120,200,255,0.2)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 110 142 L 110 220" stroke="rgba(120,200,255,0.2)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <g style={{ animation: "kneeExtend 2.4s ease-in-out infinite", transformOrigin: "150px 142px" }}>
          <path d="M 148 142 L 148 196" stroke="rgba(120,200,255,0.28)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <ellipse cx="148" cy="172" rx="16" ry="28" fill="url(#ds4_q)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
          <circle cx="148" cy="198" r="7" fill="rgba(0,200,83,0.12)" stroke="rgba(0,200,83,0.5)" strokeWidth="1.2" />
          <path d="M 148 198 L 148 258" stroke="rgba(120,200,255,0.26)" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    );
  }

  if (name.includes("Squat") && !name.includes("Single")) {
    return (
      <svg viewBox="0 0 280 280" width="100%" height="100%">
        <defs>
          <radialGradient id="ds5_q" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ds5_g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF9500" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g style={{ animation: "squatDown 2.8s ease-in-out infinite" }}>
          <rect x="98" y="72" width="64" height="78" rx="12" fill="none" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
          <ellipse cx="130" cy="54" rx="16" ry="18" fill="none" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
          <path d="M 104 84 Q 78 96 64 108" stroke="rgba(120,200,255,0.18)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 156 84 Q 182 96 196 108" stroke="rgba(120,200,255,0.18)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="130" cy="148" rx="38" ry="13" fill="url(#ds5_g)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />
          <path d="M 114 150 L 92 198" stroke="rgba(120,200,255,0.28)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <ellipse cx="102" cy="174" rx="12" ry="24" transform="rotate(-16 102 174)" fill="url(#ds5_q)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />
          <circle cx="92" cy="198" r="6" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
          <path d="M 92 198 L 100 252" stroke="rgba(120,200,255,0.22)" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 146 150 L 168 198" stroke="rgba(120,200,255,0.28)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <ellipse cx="158" cy="174" rx="12" ry="24" transform="rotate(16 158 174)" fill="url(#ds5_q)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />
          <circle cx="168" cy="198" r="6" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
          <path d="M 168 198 L 160 252" stroke="rgba(120,200,255,0.22)" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
        <line x1="50" y1="258" x2="230" y2="258" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="6 5" />
      </svg>
    );
  }

  if (name.includes("Single")) {
    return (
      <svg viewBox="0 0 280 290" width="100%" height="100%" style={{ animation: "wobble 2s ease-in-out infinite" }}>
        <defs>
          <radialGradient id="ds6_q" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ds6_g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF9500" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="96" y="66" width="64" height="80" rx="12" fill="none" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
        <ellipse cx="128" cy="48" rx="16" ry="18" fill="none" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
        <path d="M 102 76 Q 80 82 66 78" stroke="rgba(120,200,255,0.18)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 154 76 Q 176 82 190 78" stroke="rgba(120,200,255,0.18)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="120" cy="144" rx="28" ry="12" fill="url(#ds6_g)" style={{ animation: "muscleGlow 2s ease-in-out infinite" }} />
        <path d="M 118 146 L 104 200" stroke="rgba(120,200,255,0.28)" strokeWidth="8" strokeLinecap="round" fill="none" />
        <ellipse cx="112" cy="174" rx="13" ry="28" transform="rotate(-12 112 174)" fill="url(#ds6_q)" style={{ animation: "muscleGlow 2s ease-in-out infinite" }} />
        <circle cx="104" cy="200" r="6" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
        <path d="M 104 200 L 112 264" stroke="rgba(120,200,255,0.22)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M 138 146 L 158 172" stroke="rgba(120,200,255,0.15)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M 158 172 L 168 218" stroke="rgba(120,200,255,0.12)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <line x1="60" y1="270" x2="220" y2="270" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="6 5" />
      </svg>
    );
  }

  if (name.includes("Step")) {
    return (
      <svg viewBox="0 0 280 290" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
        <defs>
          <radialGradient id="ds7_q" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="60" y="204" width="140" height="52" rx="4" fill="none" stroke="rgba(120,200,255,0.2)" strokeWidth="0.8" />
        <rect x="60" y="198" width="140" height="8" rx="2" fill="none" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
        <line x1="50" y1="256" x2="230" y2="256" stroke="rgba(120,200,255,0.12)" strokeWidth="1" strokeDasharray="5 4" />
        <g style={{ animation: "stepUp 2.4s ease-in-out infinite" }}>
          <path d="M 128 152 L 104 198" stroke="rgba(120,200,255,0.28)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <ellipse cx="116" cy="174" rx="13" ry="24" transform="rotate(-20 116 174)" fill="url(#ds7_q)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
          <circle cx="104" cy="198" r="6" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
          <path d="M 104 198 L 114 198" stroke="rgba(120,200,255,0.22)" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
        <rect x="96" y="58" width="64" height="86" rx="12" fill="none" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
        <ellipse cx="128" cy="40" rx="16" ry="18" fill="none" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
        <path d="M 142 154 L 168 198" stroke="rgba(120,200,255,0.2)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 168 198 L 178 256" stroke="rgba(120,200,255,0.16)" strokeWidth="5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  /* Lunges fallback + default */
  return (
    <svg viewBox="0 0 320 290" width="100%" height="100%" style={{ animation: "lunge-osc 2.4s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="ds8_q" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="130" y="50" width="60" height="80" rx="12" transform="rotate(3 160 90)" fill="none" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
      <ellipse cx="167" cy="34" rx="15" ry="17" fill="none" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
      <path d="M 150 130 L 124 190" stroke="rgba(120,200,255,0.28)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="137" cy="160" rx="12" ry="28" transform="rotate(-12 137 160)" fill="url(#ds8_q)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
      <circle cx="124" cy="190" r="6" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
      <path d="M 124 190 L 124 258" stroke="rgba(120,200,255,0.22)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 166 130 L 210 144" stroke="rgba(120,200,255,0.2)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M 210 144 L 226 230" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <line x1="60" y1="260" x2="280" y2="260" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="6 5" />
    </svg>
  );
}

/* ─── Skeleton pose overlay on camera ─── */
function SkeletonOverlay({ kneeAngle, visible }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      if (!visible) { rafRef.current = requestAnimationFrame(draw); return; }

      const lift = (kneeAngle / 130) * H * 0.09;
      const j = {
        head:    { x: W * 0.50, y: H * 0.10 },
        neck:    { x: W * 0.50, y: H * 0.19 },
        sL:      { x: W * 0.37, y: H * 0.27 },
        sR:      { x: W * 0.63, y: H * 0.27 },
        eL:      { x: W * 0.28, y: H * 0.40 },
        eR:      { x: W * 0.72, y: H * 0.40 },
        wL:      { x: W * 0.22, y: H * 0.52 },
        wR:      { x: W * 0.78, y: H * 0.52 },
        hipL:    { x: W * 0.41, y: H * 0.49 },
        hipR:    { x: W * 0.59, y: H * 0.49 },
        kneeL:   { x: W * 0.39, y: H * 0.65 - lift },
        kneeR:   { x: W * 0.61, y: H * 0.65 - lift },
        ankleL:  { x: W * 0.37, y: H * 0.83 },
        ankleR:  { x: W * 0.63, y: H * 0.83 },
      };

      const connections = [
        ["neck","sL"],["neck","sR"],["sL","eL"],["eL","wL"],
        ["sR","eR"],["eR","wR"],["neck","hipL"],["neck","hipR"],
        ["hipL","hipR"],["hipL","kneeL"],["hipR","kneeR"],
        ["kneeL","ankleL"],["kneeR","ankleR"],
      ];

      ctx.shadowColor = "#00C853";
      ctx.shadowBlur = 6;
      ctx.strokeStyle = "#00C853";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      connections.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(j[a].x, j[a].y);
        ctx.lineTo(j[b].x, j[b].y);
        ctx.stroke();
      });

      Object.entries(j).forEach(([key, pt]) => {
        const isKnee = key === "kneeL" || key === "kneeR";
        ctx.shadowBlur = isKnee ? 14 : 8;
        ctx.shadowColor = isKnee ? "#FF9500" : "#00C853";
        ctx.fillStyle = isKnee ? "#FF9500" : "#00C853";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isKnee ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [kneeAngle, visible]);

  return (
    <canvas
      ref={canvasRef}
      width={420}
      height={560}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ─── Webcam with skeleton ─── */
function CameraFeed({ kneeAngle, countdown }) {
  const vidRef = useRef(null);
  const [active, setActive] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let stream;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then(s => {
        stream = s;
        if (vidRef.current) vidRef.current.srcObject = s;
        setActive(true);
      })
      .catch(() => setDenied(true));
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  return (
    <div style={{
      position: "relative", width: "100%", flex: 1,
      borderRadius: 16, overflow: "hidden",
      background: "#0A0A0A",
      minHeight: 0,
    }}>
      {/* Camera feed */}
      {active && (
        <video
          ref={vidRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", display: "block" }}
        />
      )}

      {!active && !denied && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#555", fontSize: 13, fontFamily: font }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid #222", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#333" }} />
          </div>
          Activating camera…
        </div>
      )}

      {denied && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ color: "#555", fontSize: 13, fontFamily: font }}>Position yourself in frame</span>
        </div>
      )}

      {/* Skeleton overlay */}
      <SkeletonOverlay kneeAngle={kneeAngle} visible={active && countdown === 0} />

      {/* No-person hint if camera is active but countdown done */}
      {!active && countdown === 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#555", fontSize: 14, fontFamily: font }}>Position yourself in frame</span>
        </div>
      )}

      {/* Countdown overlay */}
      {countdown > 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)",
        }}>
          <div key={countdown} style={{
            color: "#FFFFFF", fontSize: 96, fontWeight: 900, fontFamily: font,
            textShadow: "0 0 40px rgba(0,200,83,0.8), 0 0 80px rgba(0,200,83,0.4)",
            animation: "countdownPop 0.9s cubic-bezier(0.16,1,0.3,1) both",
            lineHeight: 1,
          }}>
            {countdown}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXERCISE SESSION COMPONENT
══════════════════════════════════════════════════════════ */
export default function ExerciseSession({ patient, exercise, onComplete, onBack }) {
  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(1);
  const [kneeAngle, setKneeAngle] = useState(20);
  const [showFlash, setShowFlash] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const TARGET_REPS = 15;
  const TOTAL_SETS = 3;
  const exerciseName = exercise?.name || "Exercise";
  const cue = CUES[exerciseName] || "Perform each rep slowly with full control";

  /* Countdown */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* Timer */
  useEffect(() => {
    if (countdown > 0) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  /* Simulate reps + knee angle */
  useEffect(() => {
    if (countdown > 0) return;
    let t = 0;
    const id = setInterval(() => {
      t += 0.04;
      const angle = Math.round(18 + ((Math.sin(t) + 1) / 2) * 80);
      setKneeAngle(angle);
      if (Math.sin(t) > 0.97 && Math.sin(t - 0.04) <= 0.97) {
        setReps(r => Math.min(r + 1, TARGET_REPS));
      }
    }, 80);
    return () => clearInterval(id);
  }, [countdown]);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const recording = countdown === 0;
  const setDone = reps >= TARGET_REPS;

  const handleCompleteSet = () => {
    if (sets < TOTAL_SETS) {
      setSets(s => s + 1);
      setReps(0);
      setCountdown(2);
    } else {
      setShowFlash(true);
      setTimeout(() => {
        setShowFlash(false);
        onComplete({ m: { knee: kneeAngle, sym: 87, reps: TARGET_REPS }, exercise });
      }, 1200);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000000",
      display: "flex", flexDirection: "column",
      fontFamily: font, zIndex: 100,
    }}>
      <style>{SESSION_CSS}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", padding: "12px 16px", gap: 12,
      }}>
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)", color: "#A0A0A0", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <X size={18} />
        </button>
        <span style={{ flex: 1, color: "#FFFFFF", fontWeight: 700, fontSize: 15, textAlign: "center", letterSpacing: -0.2 }}>
          {exerciseName}
        </span>
        <button style={{
          width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)", color: "#A0A0A0", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Settings size={17} />
        </button>
      </div>

      {/* ── CAMERA SECTION (65%) ── */}
      <div style={{ flex: "0 0 65%", position: "relative", padding: "56px 12px 0" }}>
        <CameraFeed kneeAngle={kneeAngle} countdown={countdown} />

        {/* REC indicator */}
        {recording && (
          <div style={{
            position: "absolute", top: 68, left: 24, zIndex: 10,
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(0,0,0,0.72)", borderRadius: 99, padding: "6px 12px 6px 10px",
          }}>
            {/* Halo ring */}
            <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "#FF3B30",
                animation: "recHalo 1s ease-out infinite",
              }} />
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "#FF3B30",
                boxShadow: "0 0 10px 4px rgba(255,59,48,0.8)",
                animation: "recPulse 1s ease-in-out infinite",
              }} />
            </div>
            <span style={{ color: "#FF3B30", fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>REC</span>
          </div>
        )}

        {/* Exercise info + rep counter */}
        {recording && (
          <div style={{
            position: "absolute", top: 68, right: 24, zIndex: 10,
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
            padding: "10px 14px", textAlign: "center",
          }}>
            <div style={{ color: "#A0A0A0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Set {sets}/{TOTAL_SETS}
            </div>
            <div style={{ color: "#FFFFFF", fontWeight: 900, fontSize: 28, lineHeight: 1, marginTop: 2 }}>
              {reps}
            </div>
            <div style={{ color: "#A0A0A0", fontSize: 10, marginTop: 2 }}>
              of {TARGET_REPS} reps
            </div>
          </div>
        )}

        {/* Session timer */}
        {recording && (
          <div style={{
            position: "absolute", bottom: 10, right: 24, zIndex: 10,
            color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
          }}>
            {fmt(elapsed)}
          </div>
        )}
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #00C853, transparent)", opacity: 0.5, flexShrink: 0 }} />

      {/* ── DEMONSTRATION PANEL (35%) ── */}
      <div style={{
        flex: "0 0 35%", background: "#000000",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        {/* Scanline */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 1.5,
          background: "linear-gradient(90deg, transparent, rgba(120,200,255,0.07), transparent)",
          animation: "scanline 6s linear infinite",
          pointerEvents: "none", zIndex: 3,
        }} />
        {/* Ambient glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(100,180,255,0.04) 0%, transparent 70%)",
        }} />

        {/* Label */}
        <div style={{ padding: "8px 16px 0", flexShrink: 0, position: "relative", zIndex: 4 }}>
          <span style={{ color: "#444", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2 }}>
            Demonstration
          </span>
        </div>

        {/* Figure */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", zIndex: 2, overflow: "hidden", padding: "0 16px",
        }}>
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DemoFigure exerciseName={exerciseName} />
          </div>
        </div>

        {/* Coaching cue */}
        <div style={{
          padding: "0 16px 12px", textAlign: "center", flexShrink: 0, position: "relative", zIndex: 4,
        }}>
          <div style={{ color: "#555", fontSize: 11, marginBottom: 2 }}>
            ↑ Match this movement
          </div>
          <div style={{ color: "#777", fontSize: 12, fontWeight: 500 }}>
            {cue}
          </div>
        </div>
      </div>

      {/* ── COMPLETE SET BUTTON ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
        padding: "0 16px 24px",
        animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
      }}>
        {setDone ? (
          <button
            onClick={handleCompleteSet}
            style={{
              width: "100%", height: 56, borderRadius: 16, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #00C853, #1B5E20)",
              color: "#FFFFFF", fontWeight: 800, fontSize: 17, fontFamily: font,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: "0 4px 28px rgba(0,200,83,0.45)",
            }}>
            <Check size={22} strokeWidth={3} />
            {sets < TOTAL_SETS ? `Complete Set ${sets}` : "Finish Exercise"}
          </button>
        ) : (
          <div style={{
            width: "100%", height: 56, borderRadius: 16,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF3B30", animation: "pulseDot 1s ease-in-out infinite" }} />
            <span style={{ color: "#A0A0A0", fontWeight: 600, fontSize: 15, fontFamily: font }}>Recording…</span>
          </div>
        )}
      </div>

      {/* ── GREEN FLASH ── */}
      {showFlash && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 500, pointerEvents: "none",
          background: "rgba(0,200,83,0.35)",
          animation: "greenFlash 1.2s ease forwards",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="rgba(0,200,83,0.2)" stroke="rgba(0,200,83,0.6)" strokeWidth="1.5" />
            <path d="M 28 50 L 44 68 L 72 34" stroke="#00C853" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
              fill="none" strokeDasharray="120" style={{ animation: "checkmarkDraw 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both" }} />
          </svg>
        </div>
      )}

      {/* ── EXIT CONFIRM ── */}
      {showConfirm && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }}>
          <div style={{
            width: "100%", background: "#111", borderRadius: "20px 20px 0 0",
            border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none",
            padding: "24px 20px 40px",
          }}>
            <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Stop Recording?</div>
            <div style={{ color: "#A0A0A0", fontSize: 14, marginBottom: 24 }}>Your progress on this set will not be saved.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowConfirm(false)} style={{
                flex: 1, height: 48, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent", color: "#FFFFFF", fontWeight: 700, fontSize: 15, fontFamily: font, cursor: "pointer",
              }}>Keep Going</button>
              <button onClick={onBack} style={{
                flex: 1, height: 48, borderRadius: 12, border: "none",
                background: "#1A1A1A", color: "#FF3B30", fontWeight: 700, fontSize: 15, fontFamily: font, cursor: "pointer",
              }}>Stop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { Timer, HelpCircle, ChevronLeft, ChevronRight, Menu, MoreHorizontal } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   ANIMATED ANATOMICAL MESH FIGURES
   Pure SVG/CSS — no video elements
══════════════════════════════════════════════════════════ */

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

/* Shared CSS for all figures */
const FIGURE_CSS = `
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.018); }
  }
  @keyframes scanline {
    0% { top: -4px; opacity: 0; }
    5% { opacity: 0.04; }
    95% { opacity: 0.04; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes muscleGlow {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  @keyframes pulseGreen {
    0%, 100% { r: 7; opacity: 0.8; }
    50% { r: 11; opacity: 1; }
  }
  @keyframes wobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(0.8deg); }
    75% { transform: rotate(-0.8deg); }
  }
  @keyframes lunge-osc {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(3px); }
  }
  @keyframes legFlex {
    0%, 100% { d: path("M 55 195 Q 52 230 58 265 Q 62 278 68 280"); }
    50% { d: path("M 55 195 Q 48 225 52 258 Q 56 272 62 276"); }
  }
  @keyframes armSwing {
    0%, 100% { transform: rotate(0deg); transform-origin: 50px 110px; }
    50% { transform: rotate(-6deg); transform-origin: 50px 110px; }
  }
  @keyframes glowPulse {
    0%,100% { filter: drop-shadow(0 0 8px #FF3B30) drop-shadow(0 0 20px #FF3B30AA); }
    50% { filter: drop-shadow(0 0 14px #FF3B30) drop-shadow(0 0 32px #FF3B30CC); }
  }
  @keyframes glowPulseGreen {
    0%,100% { filter: drop-shadow(0 0 8px #00C853) drop-shadow(0 0 20px #00C85388); }
    50% { filter: drop-shadow(0 0 14px #00C853) drop-shadow(0 0 32px #00C853AA); }
  }
  @keyframes kneeExtend {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-18deg); }
  }
  @keyframes squatDown {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(8px); }
  }
  @keyframes heelSlide {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(-22px); }
  }
  @keyframes stepUp {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

/* ── Shared overlay elements ── */
function ScanLine() {
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, height: 2,
      background: "linear-gradient(90deg, transparent, rgba(120,200,255,0.08), transparent)",
      animation: "scanline 6s linear infinite",
      pointerEvents: "none", zIndex: 3,
    }} />
  );
}

function AmbientGlow() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
      background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(100,180,255,0.055) 0%, transparent 70%)",
    }} />
  );
}

/* ── Mesh grid background ── */
function MeshGrid() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07, pointerEvents: "none", zIndex: 1 }}
      preserveAspectRatio="none">
      <defs>
        <pattern id="meshGrid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(120,200,255,0.5)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#meshGrid)" />
    </svg>
  );
}

/* ── Control bar ── */
function ControlBar({ exName, sets, category, elapsed = "00:12" }) {
  return (
    <>
      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
      }}>
        <div>
          <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 15, fontFamily: font, lineHeight: 1.2 }}>{exName}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: font, marginTop: 3 }}>{sets}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Menu size={18} color="rgba(255,255,255,0.6)" />
          <MoreHorizontal size={18} color="rgba(255,255,255,0.6)" />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: "12px 16px 16px",
        background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        {/* Left: badge + timer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "rgba(27,94,32,0.9)", border: "1px solid rgba(0,200,83,0.4)",
            borderRadius: 99, padding: "4px 10px",
          }}>
            <span style={{ color: "#FFFFFF", fontSize: 11, fontWeight: 700, fontFamily: font }}>{category}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Timer size={13} color="rgba(255,255,255,0.5)" />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: font }}>{elapsed}</span>
          </div>
          <HelpCircle size={15} color="rgba(255,255,255,0.4)" />
        </div>
        {/* Right: nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChevronLeft size={16} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   INDIVIDUAL EXERCISE FIGURES
══════════════════════════════════════════════════════════ */

/* 1. Lying Heel Slides */
function LyingHeelSlides() {
  return (
    <svg viewBox="0 0 400 220" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="hsPopliteal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hsHamstring" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <filter id="figureGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Torso — horizontal supine */}
      <rect x="80" y="90" width="120" height="30" rx="14" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
      {/* Head */}
      <ellipse cx="68" cy="105" rx="18" ry="16" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
      {/* Neck */}
      <rect x="82" y="99" width="10" height="12" rx="4" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.2)" strokeWidth="0.7" />

      {/* Left arm */}
      <path d="M 100 95 Q 88 78 80 72" stroke="rgba(120,200,255,0.22)" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Right arm */}
      <path d="M 140 95 Q 148 78 154 72" stroke="rgba(120,200,255,0.22)" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* RIGHT LEG (extended) */}
      <g>
        {/* Upper leg */}
        <path d="M 200 100 L 285 102" stroke="rgba(120,200,255,0.28)" strokeWidth="8" strokeLinecap="round" fill="none" />
        {/* Lower leg */}
        <path d="M 285 102 L 360 100" stroke="rgba(120,200,255,0.28)" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* Foot */}
        <ellipse cx="368" cy="100" rx="12" ry="7" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />
        {/* Knee joint */}
        <circle cx="285" cy="102" r="6" fill="rgba(120,200,255,0.1)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
      </g>

      {/* LEFT LEG (flexing) — animating heel slide */}
      <g style={{ animation: "heelSlide 2.4s ease-in-out infinite" }}>
        {/* Thigh — stays */}
        <path d="M 200 113 L 265 118" stroke="rgba(120,200,255,0.28)" strokeWidth="8" strokeLinecap="round" fill="none" />
        {/* Hamstring glow */}
        <ellipse cx="235" cy="116" rx="35" ry="12"
          fill="url(#hsHamstring)"
          style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
        {/* Knee */}
        <circle cx="265" cy="118" r="7" fill="rgba(120,200,255,0.1)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
        {/* Popliteal glow */}
        <ellipse cx="265" cy="122" rx="20" ry="14"
          fill="url(#hsPopliteal)"
          style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
        {/* Lower leg angled */}
        <path d="M 265 118 Q 280 135 295 155" stroke="rgba(120,200,255,0.28)" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* Foot */}
        <ellipse cx="298" cy="159" rx="12" ry="6" transform="rotate(30 298 159)"
          fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />
      </g>

      {/* Surface/floor line */}
      <line x1="50" y1="170" x2="390" y2="170" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="8 6" />
    </svg>
  );
}

/* 2. Seated Heel Slides */
function SeatedHeelSlides() {
  return (
    <svg viewBox="0 0 340 320" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="shs_ham" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Chair wireframe */}
      <rect x="80" y="148" width="130" height="12" rx="3" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.18)" strokeWidth="0.8" />
      {/* Chair legs */}
      <line x1="88" y1="160" x2="88" y2="240" stroke="rgba(120,200,255,0.14)" strokeWidth="2" />
      <line x1="202" y1="160" x2="202" y2="240" stroke="rgba(120,200,255,0.14)" strokeWidth="2" />
      {/* Chair back */}
      <rect x="195" y="70" width="12" height="82" rx="4" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.15)" strokeWidth="0.8" />

      {/* Torso upright */}
      <rect x="110" y="68" width="76" height="82" rx="14" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
      {/* Head */}
      <ellipse cx="148" cy="46" rx="18" ry="20" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
      {/* Neck */}
      <rect x="141" y="64" width="14" height="10" rx="4" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.15)" strokeWidth="0.7" />
      {/* Arms */}
      <path d="M 116 82 Q 98 100 94 118" stroke="rgba(120,200,255,0.2)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 180 82 Q 198 100 200 118" stroke="rgba(120,200,255,0.2)" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Right thigh horizontal */}
      <path d="M 112 153 L 164 153" stroke="rgba(120,200,255,0.25)" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Right lower leg down */}
      <path d="M 164 153 L 164 240" stroke="rgba(120,200,255,0.22)" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Right foot */}
      <ellipse cx="164" cy="246" rx="14" ry="7" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />

      {/* Left thigh horizontal */}
      <path d="M 130 155 L 182 155" stroke="rgba(120,200,255,0.25)" strokeWidth="9" strokeLinecap="round" fill="none" />

      {/* Left lower leg — heel sliding back, animating */}
      <g style={{ animation: "heelSlide 2.4s ease-in-out infinite" }}>
        {/* Hamstring glow */}
        <ellipse cx="156" cy="155" rx="30" ry="10" fill="url(#shs_ham)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
        {/* Popliteal glow */}
        <ellipse cx="182" cy="157" rx="18" ry="13" fill="rgba(255,59,48,0.5)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
        {/* Lower leg angling back */}
        <path d="M 182 155 Q 178 195 170 235" stroke="rgba(120,200,255,0.25)" strokeWidth="7" strokeLinecap="round" fill="none" />
        {/* Foot */}
        <ellipse cx="168" cy="240" rx="14" ry="6" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />
      </g>

      {/* Floor */}
      <line x1="60" y1="248" x2="280" y2="248" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="8 6" />
    </svg>
  );
}

/* 3. Straight Leg Raise */
function StraightLegRaise() {
  return (
    <svg viewBox="0 0 400 240" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="slr_quad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="slr_hipflex" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B20" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF6B20" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Torso supine */}
      <rect x="78" y="96" width="130" height="28" rx="13" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
      {/* Head */}
      <ellipse cx="65" cy="110" rx="17" ry="15" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
      {/* Neck */}
      <rect x="80" y="104" width="10" height="10" rx="4" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.15)" strokeWidth="0.7" />
      {/* Arms at sides */}
      <path d="M 98 98 Q 86 82 80 74" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 154 98 Q 162 82 166 74" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Bent non-operative leg (flat) */}
      <path d="M 208 112 L 270 114" stroke="rgba(120,200,255,0.22)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M 270 114 Q 280 140 278 166" stroke="rgba(120,200,255,0.22)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="278" cy="172" rx="13" ry="6" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.2)" strokeWidth="0.7" />

      {/* RAISING LEG — operative, animating upward */}
      <g style={{ animation: "stepUp 2.8s ease-in-out infinite", transformOrigin: "208px 122px" }}>
        {/* Quad glow along thigh */}
        <ellipse cx="256" cy="90" rx="52" ry="12" transform="rotate(-22 256 90)"
          fill="url(#slr_quad)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />
        {/* Hip flexor glow */}
        <ellipse cx="218" cy="114" rx="22" ry="16" fill="url(#slr_hipflex)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />

        {/* Upper leg raised to ~40° */}
        <path d="M 208 122 L 286 72" stroke="rgba(120,200,255,0.35)" strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* Knee highlight — locked straight */}
        <circle cx="286" cy="72" r="7" fill="rgba(0,200,83,0.15)" stroke="rgba(0,200,83,0.5)" strokeWidth="1.2" />
        {/* Lower leg — fully extended */}
        <path d="M 286 72 L 352 44" stroke="rgba(120,200,255,0.3)" strokeWidth="7" strokeLinecap="round" fill="none"
          style={{ filter: "drop-shadow(0 0 4px rgba(120,200,255,0.4))" }} />
        {/* Foot */}
        <ellipse cx="360" cy="40" rx="13" ry="6" transform="rotate(-22 360 40)"
          fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />
      </g>

      {/* Floor line */}
      <line x1="50" y1="180" x2="390" y2="180" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="8 6" />
    </svg>
  );
}

/* 4. Long Arc Quad */
function LongArcQuad() {
  return (
    <svg viewBox="0 0 340 320" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="laq_quad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="laq_knee" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00C853" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Surface edge */}
      <rect x="60" y="148" width="190" height="10" rx="3" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.18)" strokeWidth="0.8" />
      {/* Surface legs */}
      <line x1="70" y1="158" x2="70" y2="240" stroke="rgba(120,200,255,0.12)" strokeWidth="2" />
      <line x1="240" y1="158" x2="240" y2="240" stroke="rgba(120,200,255,0.12)" strokeWidth="2" />
      <line x1="70" y1="240" x2="240" y2="240" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />

      {/* Torso upright */}
      <rect x="110" y="52" width="72" height="100" rx="14" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
      {/* Head */}
      <ellipse cx="146" cy="34" rx="18" ry="20" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
      <rect x="139" y="52" width="14" height="10" rx="4" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.15)" strokeWidth="0.7" />
      {/* Arms */}
      <path d="M 116 66 Q 98 84 94 110" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 178 66 Q 196 84 198 110" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Non-operative leg hanging at 90° */}
      <path d="M 130 152 L 130 235" stroke="rgba(120,200,255,0.2)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="130" cy="241" rx="13" ry="6" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.2)" strokeWidth="0.7" />

      {/* OPERATIVE LEG extending — animating */}
      <g style={{ animation: "kneeExtend 2.4s ease-in-out infinite", transformOrigin: "160px 152px" }}>
        {/* Thigh — from seat */}
        <path d="M 158 152 L 158 210" stroke="rgba(120,200,255,0.28)" strokeWidth="9" strokeLinecap="round" fill="none" />

        {/* Quad glow — rectus femoris + vastus lateralis */}
        <ellipse cx="158" cy="185" rx="18" ry="32"
          fill="url(#laq_quad)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />

        {/* Knee joint — green pulse */}
        <circle cx="158" cy="212" r="8" fill="rgba(0,200,83,0.12)" stroke="rgba(0,200,83,0.5)" strokeWidth="1.5" />
        <circle cx="158" cy="212" r="14" fill="rgba(0,200,83,0.0)" stroke="rgba(0,200,83,0.25)" strokeWidth="1"
          style={{ animation: "glowPulseGreen 2.4s ease-in-out infinite" }} />

        {/* Lower leg extending */}
        <path d="M 158 212 L 158 278" stroke="rgba(120,200,255,0.28)" strokeWidth="7" strokeLinecap="round" fill="none" />
        {/* Foot */}
        <ellipse cx="158" cy="284" rx="14" ry="6" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />
      </g>
    </svg>
  );
}

/* 5. Air Squats (bilateral) */
function AirSquats({ depth = 60 }) {
  return (
    <svg viewBox="0 0 340 320" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="sq_quad_l" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sq_quad_r" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sq_glute" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF9500" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Torso dropping in squat */}
      <g style={{ animation: "squatDown 2.8s ease-in-out infinite" }}>
        <rect x="112" y="80" width="76" height="88" rx="14" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
        {/* Head */}
        <ellipse cx="150" cy="60" rx="18" ry="20" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
        <rect x="143" y="78" width="14" height="8" rx="3" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.15)" strokeWidth="0.7" />
        {/* Arms forward for balance */}
        <path d="M 118 90 Q 82 108 66 120" stroke="rgba(120,200,255,0.2)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 182 90 Q 218 108 234 120" stroke="rgba(120,200,255,0.2)" strokeWidth="5" strokeLinecap="round" fill="none" />

        {/* Glute glow */}
        <ellipse cx="150" cy="165" rx="44" ry="16" fill="url(#sq_glute)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />

        {/* LEFT thigh angled out ~60° */}
        <path d="M 134 168 L 108 218" stroke="rgba(120,200,255,0.28)" strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* Left quad glow */}
        <ellipse cx="120" cy="193" rx="14" ry="28" transform="rotate(-18 120 193)"
          fill="url(#sq_quad_l)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />
        {/* Left knee */}
        <circle cx="108" cy="218" r="7" fill="rgba(120,200,255,0.1)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
        {/* Left lower leg */}
        <path d="M 108 218 L 118 278" stroke="rgba(120,200,255,0.25)" strokeWidth="7" strokeLinecap="round" fill="none" />
        {/* Left foot */}
        <ellipse cx="120" cy="283" rx="16" ry="6" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />

        {/* RIGHT thigh angled out */}
        <path d="M 166 168 L 192 218" stroke="rgba(120,200,255,0.28)" strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* Right quad glow */}
        <ellipse cx="180" cy="193" rx="14" ry="28" transform="rotate(18 180 193)"
          fill="url(#sq_quad_r)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />
        {/* Right knee */}
        <circle cx="192" cy="218" r="7" fill="rgba(120,200,255,0.1)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
        {/* Right lower leg */}
        <path d="M 192 218 L 182 278" stroke="rgba(120,200,255,0.25)" strokeWidth="7" strokeLinecap="round" fill="none" />
        {/* Right foot */}
        <ellipse cx="180" cy="283" rx="16" ry="6" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />
      </g>

      {/* Ankle dorsiflexion highlight */}
      <ellipse cx="120" cy="283" rx="14" ry="8" fill="rgba(0,200,83,0.2)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />
      <ellipse cx="180" cy="283" rx="14" ry="8" fill="rgba(0,200,83,0.2)" style={{ animation: "muscleGlow 2.8s ease-in-out infinite" }} />

      {/* Floor */}
      <line x1="50" y1="290" x2="290" y2="290" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="8 6" />
    </svg>
  );
}

/* 6. Single Leg Squat */
function SingleLegSquat() {
  return (
    <svg viewBox="0 0 340 320" width="100%" height="100%"
      style={{ animation: "wobble 2s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="sls_quad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sls_glute" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF9500" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sls_hipstab" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Torso */}
      <rect x="113" y="74" width="72" height="90" rx="14" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
      {/* Head */}
      <ellipse cx="149" cy="54" rx="18" ry="20" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
      <rect x="142" y="72" width="14" height="8" rx="3" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.15)" strokeWidth="0.7" />
      {/* Arms out for balance */}
      <path d="M 119 84 Q 88 90 72 86" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 181 84 Q 212 90 228 86" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Hip stabilizer lateral glow */}
      <ellipse cx="130" cy="158" rx="24" ry="18" fill="url(#sls_hipstab)" style={{ animation: "muscleGlow 2s ease-in-out infinite" }} />
      {/* Glute glow */}
      <ellipse cx="149" cy="162" rx="32" ry="14" fill="url(#sls_glute)" style={{ animation: "muscleGlow 2s ease-in-out infinite" }} />

      {/* OPERATIVE LEG in single-leg squat */}
      <path d="M 142 164 L 128 222" stroke="rgba(120,200,255,0.28)" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Quad glow */}
      <ellipse cx="136" cy="193" rx="15" ry="32" transform="rotate(-14 136 193)"
        fill="url(#sls_quad)" style={{ animation: "muscleGlow 2s ease-in-out infinite" }} />
      {/* Knee */}
      <circle cx="128" cy="222" r="7" fill="rgba(120,200,255,0.1)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
      {/* Lower leg */}
      <path d="M 128 222 L 138 290" stroke="rgba(120,200,255,0.25)" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Foot */}
      <ellipse cx="140" cy="295" rx="16" ry="6" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />

      {/* Non-operative leg raised slightly */}
      <path d="M 158 164 L 184 192" stroke="rgba(120,200,255,0.18)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M 184 192 L 196 238" stroke="rgba(120,200,255,0.15)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="198" cy="243" rx="12" ry="5" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.15)" strokeWidth="0.7" />

      {/* Floor */}
      <line x1="80" y1="298" x2="260" y2="298" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="8 6" />
    </svg>
  );
}

/* 7. Step-Ups */
function StepUps() {
  return (
    <svg viewBox="0 0 340 320" width="100%" height="100%" style={{ animation: "breathe 3s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="su_quad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="su_glute" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Elevated platform wireframe box */}
      <rect x="60" y="218" width="160" height="60" rx="4" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.2)" strokeWidth="0.8" />
      {/* Platform top surface */}
      <rect x="60" y="212" width="160" height="8" rx="2" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
      {/* Floor level */}
      <line x1="50" y1="278" x2="290" y2="278" stroke="rgba(120,200,255,0.12)" strokeWidth="1" strokeDasharray="6 5" />

      {/* LEADING LEG (operative) — on platform, animating step up */}
      <g style={{ animation: "stepUp 2.4s ease-in-out infinite" }}>
        {/* Thigh at ~70° knee flexion */}
        <path d="M 148 168 L 120 212" stroke="rgba(120,200,255,0.28)" strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* Quad glow */}
        <ellipse cx="134" cy="190" rx="15" ry="26" transform="rotate(-22 134 190)"
          fill="url(#su_quad)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
        {/* Glute glow */}
        <ellipse cx="148" cy="168" rx="20" ry="14" fill="url(#su_glute)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
        {/* Knee */}
        <circle cx="120" cy="212" r="7" fill="rgba(120,200,255,0.1)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
        {/* Lower leg on platform */}
        <path d="M 120 212 L 130 212" stroke="rgba(120,200,255,0.25)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="136" cy="212" rx="12" ry="5" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />
      </g>

      {/* Torso */}
      <rect x="118" y="76" width="72" height="94" rx="14" fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
      {/* Head */}
      <ellipse cx="154" cy="56" rx="18" ry="20" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
      <rect x="147" y="74" width="14" height="8" rx="3" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.15)" strokeWidth="0.7" />
      {/* Arms */}
      <path d="M 124 90 Q 108 108 104 124" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 184 90 Q 200 108 204 124" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Trailing leg on floor */}
      <path d="M 160 170 L 188 220" stroke="rgba(120,200,255,0.2)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="188" cy="220" r="6" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />
      <path d="M 188 220 L 200 278" stroke="rgba(120,200,255,0.18)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="202" cy="283" rx="13" ry="5" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.18)" strokeWidth="0.7" />
    </svg>
  );
}

/* 8. Forward Lunges */
function ForwardLunges() {
  return (
    <svg viewBox="0 0 380 320" width="100%" height="100%"
      style={{ animation: "lunge-osc 2.4s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="lunge_quad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lunge_hipflex" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B20" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF6B20" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lunge_hipext" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Torso — slight forward lean */}
      <rect x="148" y="60" width="72" height="92" rx="14" transform="rotate(4 184 106)"
        fill="rgba(120,200,255,0.07)" stroke="rgba(120,200,255,0.28)" strokeWidth="0.8" />
      {/* Head */}
      <ellipse cx="196" cy="42" rx="18" ry="20" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.25)" strokeWidth="0.8" />
      <rect x="189" y="60" width="14" height="8" rx="3" fill="rgba(120,200,255,0.05)" stroke="rgba(120,200,255,0.15)" strokeWidth="0.7" />
      {/* Arms */}
      <path d="M 154 74 Q 138 90 130 108" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 214 74 Q 228 90 234 108" stroke="rgba(120,200,255,0.18)" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* FRONT LEG (operative) — knee at ~90° */}
      {/* Front thigh */}
      <path d="M 178 152 L 148 212" stroke="rgba(120,200,255,0.28)" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Quad + hip flexor glow */}
      <ellipse cx="163" cy="182" rx="15" ry="32" transform="rotate(-14 163 182)"
        fill="url(#lunge_quad)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
      <ellipse cx="180" cy="152" rx="20" ry="14" fill="url(#lunge_hipflex)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
      {/* Front knee at ~90° */}
      <circle cx="148" cy="212" r="7" fill="rgba(120,200,255,0.1)" stroke="rgba(120,200,255,0.3)" strokeWidth="0.8" />
      {/* Front lower leg vertical */}
      <path d="M 148 212 L 148 286" stroke="rgba(120,200,255,0.25)" strokeWidth="7" strokeLinecap="round" fill="none" />
      <ellipse cx="148" cy="291" rx="16" ry="6" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />

      {/* REAR LEG — hip extensor highlighted */}
      <path d="M 188 152 L 246 168" stroke="rgba(120,200,255,0.22)" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Hip extensor glow */}
      <ellipse cx="218" cy="160" rx="32" ry="12" transform="rotate(14 218 160)"
        fill="url(#lunge_hipext)" style={{ animation: "muscleGlow 2.4s ease-in-out infinite" }} />
      {/* Rear knee near floor */}
      <circle cx="246" cy="168" r="6" fill="rgba(120,200,255,0.08)" stroke="rgba(120,200,255,0.22)" strokeWidth="0.7" />
      {/* Rear lower leg */}
      <path d="M 246 168 L 264 260" stroke="rgba(120,200,255,0.2)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="266" cy="265" rx="14" ry="5" fill="rgba(120,200,255,0.06)" stroke="rgba(120,200,255,0.18)" strokeWidth="0.7" />

      {/* Floor */}
      <line x1="60" y1="292" x2="320" y2="292" stroke="rgba(120,200,255,0.1)" strokeWidth="1" strokeDasharray="8 6" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   FIGURE REGISTRY
══════════════════════════════════════════════════════════ */
const FIGURE_MAP = {
  "Lying Heel Slides":    { Figure: LyingHeelSlides,  category: "Mobility",  sets: "3 × 15 reps" },
  "Seated Heel Slides":   { Figure: SeatedHeelSlides, category: "Mobility",  sets: "3 × 15 reps" },
  "Straight Leg Raises":  { Figure: StraightLegRaise, category: "Strength",  sets: "3 × 10 reps" },
  "Long Arc Quad":        { Figure: LongArcQuad,      category: "Strength",  sets: "3 × 15 reps" },
  "Air Squats (60°)":     { Figure: AirSquats,         category: "Strength",  sets: "3 × 12 reps" },
  "Air Squats (30°)":     { Figure: AirSquats,         category: "Mobility",  sets: "3 × 12 reps" },
  "Single Leg Squat 50%": { Figure: SingleLegSquat,   category: "Strength",  sets: "3 × 10 reps" },
  "Single Leg Squat Max": { Figure: SingleLegSquat,   category: "Strength",  sets: "3 × 8 reps"  },
  "Step-Ups":             { Figure: StepUps,           category: "Strength",  sets: "3 × 12 reps" },
  "Forward Lunges":       { Figure: ForwardLunges,     category: "Strength",  sets: "3 × 10 reps" },
};

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */
export default function ExerciseFigure({ exerciseName }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const entry = FIGURE_MAP[exerciseName];
  if (!entry) return null;
  const { Figure, category, sets } = entry;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "9/16",
      maxHeight: "75vh",
      background: "#000000",
      borderRadius: 18,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <style>{FIGURE_CSS}</style>

      {/* Layers */}
      <MeshGrid />
      <AmbientGlow />
      <ScanLine />

      {/* Figure — centered, 75% height */}
      <div style={{
        position: "relative", zIndex: 2,
        width: "75%", height: "75%",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Figure />
      </div>

      {/* Overlay controls */}
      <ControlBar
        exName={exerciseName}
        sets={sets}
        category={category}
        elapsed={fmt(elapsed)}
      />
    </div>
  );
}
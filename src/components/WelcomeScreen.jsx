import { useState, useEffect, useRef } from "react";
import {
  User, Lock, Eye, EyeOff, ArrowRight, Building,
  Shield, CheckCircle
} from "lucide-react";
import ValorLogo, { ValorIcon } from "./ValorLogo";

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

const CSS = `
  @keyframes particleDrift {
    0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
    10%  { opacity: 0.3; }
    90%  { opacity: 0.2; }
    100% { transform: translateY(-110vh) translateX(var(--dx)); opacity: 0; }
  }
  @keyframes glowPulse {
    0%,100% { opacity: 0.7; }
    50%     { opacity: 1; }
  }
  @keyframes breatheMesh { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.012); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

/* ── Particles ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  size: 1 + Math.random() * 2,
  duration: 14 + Math.random() * 14,
  delay: Math.random() * 12,
  dx: `${(Math.random() - 0.5) * 60}px`,
}));

function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: p.left, bottom: "-6px",
          width: p.size, height: p.size, borderRadius: "50%",
          background: "rgba(255,255,255,0.85)",
          "--dx": p.dx,
          animation: `particleDrift ${p.duration}s ${p.delay}s linear infinite`,
        }} />
      ))}
    </div>
  );
}

/* ── Grid ── */
function GridBg({ vis }) {
  return (
    <svg style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      opacity: vis ? 1 : 0, transition: "opacity 0.6s ease",
      pointerEvents: "none", zIndex: 0,
    }} preserveAspectRatio="none">
      <defs>
        <pattern id="wGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wGrid)" />
    </svg>
  );
}

/* ── Background anatomical mesh figure ── */
function BackgroundMesh({ vis }) {
  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%",
      opacity: vis ? 0.065 : 0,
      transition: "opacity 0.9s ease",
      pointerEvents: "none", zIndex: 1,
      animation: vis ? "breatheMesh 5s ease-in-out infinite" : "none",
    }}>
      <svg width="300" height="540" viewBox="0 0 160 320" fill="none">
        <ellipse cx="80" cy="28" rx="20" ry="24" fill="none" stroke="rgba(120,200,255,0.65)" strokeWidth="0.8" />
        <rect x="72" y="50" width="16" height="14" rx="4" fill="none" stroke="rgba(120,200,255,0.5)" strokeWidth="0.7" />
        <path d="M45 64 L35 130 L55 130 L55 160 L105 160 L105 130 L125 130 L115 64 Z" fill="rgba(120,200,255,0.03)" stroke="rgba(120,200,255,0.5)" strokeWidth="0.7" />
        <ellipse cx="38" cy="72" rx="14" ry="10" fill="none" stroke="rgba(120,200,255,0.4)" strokeWidth="0.6" />
        <ellipse cx="122" cy="72" rx="14" ry="10" fill="none" stroke="rgba(120,200,255,0.4)" strokeWidth="0.6" />
        <path d="M26 72 Q14 104 18 130 L28 130 Q32 104 36 78 Z" fill="none" stroke="rgba(120,200,255,0.4)" strokeWidth="0.6" />
        <path d="M134 72 Q146 104 142 130 L132 130 Q128 104 124 78 Z" fill="none" stroke="rgba(120,200,255,0.4)" strokeWidth="0.6" />
        <path d="M18 130 Q14 150 18 162 L26 162 Q30 150 28 130 Z" fill="none" stroke="rgba(120,200,255,0.32)" strokeWidth="0.6" />
        <path d="M142 130 Q146 150 142 162 L134 162 Q130 150 132 130 Z" fill="none" stroke="rgba(120,200,255,0.32)" strokeWidth="0.6" />
        <path d="M57 162 Q52 195 54 228 Q56 238 66 240 L78 238 L78 162 Z" fill="none" stroke="rgba(120,200,255,0.5)" strokeWidth="0.7" />
        <path d="M103 162 Q108 195 106 228 Q104 238 94 240 L82 238 L82 162 Z" fill="none" stroke="rgba(120,200,255,0.5)" strokeWidth="0.7" />
        <ellipse cx="66" cy="244" rx="13" ry="9" fill="none" stroke="rgba(120,200,255,0.45)" strokeWidth="0.7" />
        <ellipse cx="94" cy="244" rx="13" ry="9" fill="none" stroke="rgba(120,200,255,0.45)" strokeWidth="0.7" />
        <path d="M54 252 Q52 278 54 298 Q58 304 66 304 L76 302 L76 252 Z" fill="none" stroke="rgba(120,200,255,0.38)" strokeWidth="0.6" />
        <path d="M106 252 Q108 278 106 298 Q102 304 94 304 L84 302 L84 252 Z" fill="none" stroke="rgba(120,200,255,0.38)" strokeWidth="0.6" />
        <path d="M52 298 Q48 306 50 312 L80 312 L80 298 Z" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.6" />
        <path d="M108 298 Q112 306 110 312 L80 312 L80 298 Z" fill="none" stroke="rgba(120,200,255,0.3)" strokeWidth="0.6" />
        <line x1="80" y1="50" x2="80" y2="162" stroke="rgba(120,200,255,0.2)" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="45" y1="85" x2="115" y2="85" stroke="rgba(120,200,255,0.13)" strokeWidth="0.4" />
        <line x1="40" y1="108" x2="120" y2="108" stroke="rgba(120,200,255,0.13)" strokeWidth="0.4" />
        <line x1="38" y1="128" x2="122" y2="128" stroke="rgba(120,200,255,0.12)" strokeWidth="0.4" />
        <line x1="55" y1="148" x2="105" y2="148" stroke="rgba(120,200,255,0.1)" strokeWidth="0.4" />
      </svg>
    </div>
  );
}

/* ── Reusable input ── */
function FormInput({ label, placeholder, type = "text", icon: LeftIcon, rightIcon, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ color: "#A0A0A0", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontFamily: font }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {LeftIcon && (
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? "rgba(0,200,83,0.7)" : "#555", pointerEvents: "none", transition: "color 0.2s" }}>
            <LeftIcon size={16} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", height: 48,
            background: "#0A0A0A",
            border: `1px solid ${focused ? "rgba(0,200,83,0.5)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 10,
            padding: `0 ${rightIcon ? 44 : 14}px 0 ${LeftIcon ? 42 : 14}px`,
            color: "#FFFFFF", fontSize: 14, fontFamily: font, outline: "none",
            boxSizing: "border-box", transition: "border-color 0.2s",
          }}
        />
        {rightIcon && (
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#555" }}>
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */
export default function WelcomeScreen({ onBegin }) {
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("patient");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [practiceCode, setPracticeCode] = useState("");

  // Cinematic entrance sequence
  useEffect(() => {
    const delays = [0, 200, 400, 600, 800, 1200, 1400, 1600];
    delays.forEach((d, i) => setTimeout(() => setStep(s => Math.max(s, i + 1)), d));
  }, []);

  const vis = (n) => step >= n;

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onBegin({ name: patientId.trim() || "Alex Johnson", phase: 1 });
    }, 1200);
  };

  const handleDemo = () => onBegin({ name: "Alex Johnson", phase: 1 });

  return (
    <div style={{
      minHeight: "100vh", background: "#000000",
      position: "relative", overflow: "hidden",
      fontFamily: font, display: "flex", flexDirection: "column",
      alignItems: "center",
    }}>
      <style>{CSS}</style>

      {/* Grid */}
      <GridBg vis={vis(1)} />

      {/* Bottom green glow */}
      <div style={{
        position: "absolute", bottom: "-15%", left: "50%",
        transform: "translateX(-50%)",
        width: "100%", height: "65%", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(13,51,32,0.95) 0%, transparent 70%)",
        opacity: vis(4) ? 1 : 0, transition: "opacity 1s ease",
        pointerEvents: "none", zIndex: 0,
        animation: vis(4) ? "glowPulse 4s ease-in-out infinite" : "none",
      }} />

      {/* Top-right cyan hint */}
      <div style={{
        position: "absolute", top: "-8%", right: "-12%",
        width: "55%", height: "45%", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(60,140,255,0.035) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <Particles />
      <BackgroundMesh vis={vis(2)} />

      {/* ── HERO ── */}
      <div style={{
        position: "relative", zIndex: 5,
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 52, width: "100%",
      }}>
        {/* Logo */}
        <div style={{
          opacity: vis(5) ? 1 : 0,
          transform: vis(5) ? "translateY(0px) scale(1)" : "translateY(-40px) scale(0.92)",
          transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <ValorLogo height={90} darkBg large />
        </div>

        {/* Tagline */}
        <div style={{
          opacity: vis(6) ? 1 : 0,
          transform: vis(6) ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          marginTop: 8,
          color: "#A0A0A0", fontSize: 15, fontStyle: "italic",
          letterSpacing: "0.5px", textAlign: "center",
        }}>
          A Biomechanics Lab in Your Pocket
        </div>

        {/* Gradient line */}
        <div style={{
          marginTop: 14, width: "80%", maxWidth: 320, height: 1,
          background: "linear-gradient(90deg, transparent, #00C853, transparent)",
          opacity: vis(6) ? 0.6 : 0, transition: "opacity 0.6s ease 0.15s",
        }} />

        {/* Stat pills */}
        <div style={{
          marginTop: 12, display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap",
          opacity: vis(7) ? 1 : 0,
          transform: vis(7) ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          {["17 Joint Keypoints", "<5% Error Margin", "Real-Time AI"].map(s => (
            <div key={s} style={{
              background: "rgba(0,200,83,0.08)", border: "1px solid rgba(0,200,83,0.22)",
              borderRadius: 99, padding: "4px 11px",
            }}>
              <span style={{ color: "#00C853", fontSize: 10, fontWeight: 700 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── LOGIN CARD ── */}
      <div style={{
        position: "relative", zIndex: 5,
        width: "100%", maxWidth: 420, padding: "0 16px",
        marginTop: 24,
        opacity: vis(8) ? 1 : 0,
        transform: vis(8) ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24, backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)", padding: "24px 24px 20px",
        }}>
          {/* Tab switcher */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.05)",
            borderRadius: 99, padding: 3, marginBottom: 20,
          }}>
            {[["patient", "Patient"], ["clinician", "Clinician"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                flex: 1, padding: "9px 0", borderRadius: 99, border: "none", cursor: "pointer",
                background: tab === id ? "linear-gradient(135deg, #00C853, #1B5E20)" : "transparent",
                color: tab === id ? "#FFFFFF" : "#A0A0A0",
                fontWeight: tab === id ? 700 : 500, fontSize: 13, fontFamily: font,
                transition: "all 0.25s",
                boxShadow: tab === id ? "0 0 16px rgba(0,200,83,0.35)" : "none",
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Form fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <FormInput
              label={tab === "patient" ? "Patient ID" : "Provider ID"}
              placeholder={tab === "patient" ? "Enter your patient ID" : "Enter your NPI or provider ID"}
              icon={User}
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
            />

            {tab === "clinician" && (
              <FormInput
                label="Practice Code"
                placeholder="Enter your practice code"
                icon={Building}
                value={practiceCode}
                onChange={e => setPracticeCode(e.target.value)}
              />
            )}

            <FormInput
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              icon={Lock}
              rightIcon={
                <div onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              }
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {/* Remember me */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" id="rememberW" style={{ accentColor: "#00C853", width: 14, height: 14, cursor: "pointer" }} />
              <label htmlFor="rememberW" style={{ color: "#A0A0A0", fontSize: 12, cursor: "pointer", fontFamily: font }}>
                Remember me
              </label>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%", height: 52, borderRadius: 14, border: "none",
                background: "linear-gradient(135deg, #00C853 0%, #1B5E20 100%)",
                color: "#FFFFFF", fontWeight: 800, fontSize: 15, fontFamily: font,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 4px 24px rgba(0,200,83,0.32)",
                transition: "box-shadow 0.2s, opacity 0.2s",
                opacity: loading ? 0.85 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 6px 36px rgba(0,200,83,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,200,83,0.32)"; }}
            >
              {loading ? (
                <svg width="22" height="22" viewBox="0 0 22 22" style={{ animation: "spin 0.8s linear infinite" }}>
                  <circle cx="11" cy="11" r="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
                  <path d="M 11 3 A 8 8 0 0 1 19 11" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              ) : (
                <>
                  {tab === "patient" ? "Access My Program" : "Access Patient Dashboard"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p style={{ color: "#444", fontSize: 11, textAlign: "center", margin: 0, fontFamily: font }}>
              Forgot credentials? Contact your care team
            </p>
          </div>
        </div>

        {/* Demo access */}
        <div style={{ textAlign: "center", marginTop: 18, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ color: "#555", fontSize: 12, fontFamily: font }}>Presenting today?</span>
          <button onClick={handleDemo} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#00C853", fontSize: 13, fontWeight: 700, fontFamily: font,
            textDecoration: "underline", textDecorationColor: "rgba(0,200,83,0.4)",
            padding: 0,
          }}>
            Launch Demo Mode →
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 22, paddingBottom: 36 }}>
          <div style={{ color: "#2D2D2D", fontSize: 11, fontFamily: font, marginBottom: 10, letterSpacing: "0.3px" }}>
            ValorPT Clinical Platform  •  HIPAA Compliant  •  FDA SaMD
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            {[Shield, Lock, CheckCircle].map((Icon, i) => (
              <Icon key={i} size={14} color="#2D2D2D" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Send, TrendingUp, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";

const T = {
  bg: "#0A0A0A", surface: "#111111", surface2: "#161616",
  glass: "rgba(255,255,255,0.04)", glassBorder: "rgba(255,255,255,0.08)",
  green: "#00C853", greenDeep: "#1B5E20", greenDim: "rgba(0,200,83,0.12)",
  greenGlow: "rgba(0,200,83,0.25)", greenBorder: "rgba(0,200,83,0.3)",
  white: "#FFFFFF", gray: "#A0A0A0", grayD: "#2A2A2A",
  border: "rgba(255,255,255,0.08)", orange: "#FF9500",
};
const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

/* ── Typewriter hook ── */
function useTypewriter(text, speed = 18, active = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(text); setDone(true); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, active]);
  return { displayed, done };
}

/* ── AI Avatar ── */
function AIAvatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      overflow: "hidden", background: "#FFFFFF",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 0 10px ${T.greenGlow}`,
    }}>
      <img src="https://i.imgur.com/TCSo4WN.png" alt="ValorPT" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

/* ── Typing indicator ── */
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "14px 16px" }}>
      <AIAvatar />
      <div style={{
        background: T.glass, border: `1px solid ${T.glassBorder}`,
        borderRadius: "4px 16px 16px 16px", padding: "10px 14px",
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: T.green,
            animation: `dotBounce 1.2s ${d}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── Mini inline chart ── */
function MiniChart({ data }) {
  const W = 260, H = 80, padL = 8, padR = 8, padT = 8, padB = 8;
  const cw = W - padL - padR, ch = H - padT - padB;
  const mn = Math.min(...data) - 5, mx = Math.max(...data) + 5;
  const pts = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * cw,
    y: padT + ch - ((v - mn) / (mx - mn)) * ch,
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cx = (pts[i-1].x + pts[i].x) / 2;
    d += ` C ${cx} ${pts[i-1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`;
  }
  const area = `${d} L ${pts[pts.length-1].x} ${padT+ch} L ${pts[0].x} ${padT+ch} Z`;
  return (
    <div style={{
      background: "rgba(0,200,83,0.06)", border: `1px solid ${T.greenBorder}`,
      borderRadius: 12, padding: "12px 12px 8px", marginTop: 8,
    }}>
      <div style={{ color: T.gray, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
        Knee Angle — 3 Reps
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="minicg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.green} stopOpacity="0.3" />
            <stop offset="100%" stopColor={T.green} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#minicg)" />
        <path d={d} fill="none" stroke={T.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 4px ${T.green}60)` }} />
        {pts.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="4" fill={T.green} />
            <circle cx={pt.x} cy={pt.y} r="2" fill="white" />
            <text x={pt.x} y={H - 1} textAnchor="middle" fill={T.gray} fontSize="8" fontFamily={font}>
              Rep {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Score Ring ── */
function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const size = 100, strokeWidth = 8;
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - displayed / 100);
  useEffect(() => {
    let s = 0;
    const id = setInterval(() => {
      s += 1.4;
      if (s >= score) { setDisplayed(score); clearInterval(id); }
      else setDisplayed(Math.round(s));
    }, 16);
    return () => clearInterval(id);
  }, [score]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
      <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.grayD} strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.green} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 8px ${T.green}90)` }} />
        </svg>
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div style={{ color: T.green, fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{displayed}</div>
          <div style={{ color: T.gray, fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5 }}>/100</div>
        </div>
      </div>
      <div>
        <div style={{ color: T.white, fontWeight: 800, fontSize: 15 }}>Session Score</div>
        <div style={{ color: T.green, fontSize: 12, marginTop: 2 }}>
          {score >= 85 ? "Excellent 🔥" : score >= 70 ? "Good progress" : "Keep going"}
        </div>
      </div>
    </div>
  );
}

/* ── Tip Cards ── */
function TipCards() {
  const tips = [
    { icon: "💪", text: "Engage your core before lifting" },
    { icon: "🦵", text: "Keep your knee fully locked during the raise" },
    { icon: "⏱️", text: "Slow the lowering phase to 3 seconds" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
      {tips.map((t, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(0,200,83,0.08)", border: `1px solid ${T.greenBorder}`,
          borderRadius: 10, padding: "10px 12px",
        }}>
          <span style={{ fontSize: 16 }}>{t.icon}</span>
          <span style={{ color: T.white, fontSize: 13 }}>{t.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ── A single AI chat bubble ── */
function AIBubble({ content, isTyping = false, showAvatar = true }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 16px" }}>
      {showAvatar ? <AIAvatar /> : <div style={{ width: 32, flexShrink: 0 }} />}
      <div style={{
        background: T.glass, border: `1px solid ${T.glassBorder}`,
        borderRadius: "4px 16px 16px 16px", padding: "12px 14px",
        maxWidth: "85%", fontSize: 14, color: T.white, lineHeight: 1.6,
      }}>
        {isTyping ? (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: `dotBounce 1.2s ${d}s ease-in-out infinite` }} />
            ))}
          </div>
        ) : content}
      </div>
    </div>
  );
}

/* ── User bubble ── */
function UserBubble({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 16px" }}>
      <div style={{
        background: `linear-gradient(135deg, ${T.greenDeep}, #1A3A1A)`,
        border: `1px solid ${T.greenBorder}`,
        borderRadius: "16px 4px 16px 16px", padding: "12px 14px",
        maxWidth: "80%", fontSize: 14, color: T.white, lineHeight: 1.6,
      }}>
        {text}
      </div>
    </div>
  );
}

/* ── TypewriterBubble ── */
function TypewriterBubble({ text, onDone, showAvatar = true, speed = 18 }) {
  const { displayed, done } = useTypewriter(text, speed, true);
  useEffect(() => { if (done && onDone) onDone(); }, [done]);
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 16px" }}>
      {showAvatar ? <AIAvatar /> : <div style={{ width: 32, flexShrink: 0 }} />}
      <div style={{
        background: T.glass, border: `1px solid ${T.glassBorder}`,
        borderRadius: "4px 16px 16px 16px", padding: "12px 14px",
        maxWidth: "85%", fontSize: 14, color: T.white, lineHeight: 1.6,
      }}>
        {displayed}
        {!done && <span style={{ opacity: 0.6, animation: "cursorBlink 0.8s step-end infinite" }}>|</span>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function AICoachDebrief({ patient, result, onDone, onViewReport }) {
  const exerciseName = result?.exercise?.name || "Straight Leg Raises";
  const metrics = result?.m || { knee: 98, hip: 44, sym: 87, reps: 15 };

  // Message sequence state
  // Steps: 0=msg1, 1=typing2, 2=msg2, 3=typing3(chart), 4=chart, 5=typing4, 6=msg4, 7=typing5, 8=tips, 9=typing6, 10=score, 11=inputReady
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]); // user-sent messages
  const [inputVal, setInputVal] = useState("");
  const [aiReplying, setAiReplying] = useState(false);
  const [extraMsgs, setExtraMsgs] = useState([]); // {role, text}[]
  const scrollRef = useRef(null);

  const msg1 = `Great work completing your ${exerciseName} session, ${patient?.name?.split(" ")[0] || "Alex"}. Let me break down what I observed.`;
  const msg2 = `📊 Your peak hip flexion reached ${metrics.hip}° — that's a 3° improvement from your last session. You're tracking ahead of the expected recovery curve for Week ${patient?.week || 3}.`;
  const msg4 = `⚠️ I noticed some asymmetry in reps 2 and 3 — your left hip was compensating slightly. This is common at this stage but worth monitoring.`;
  const msg5prefix = `Here's what to focus on next session:`;
  const msg6prefix = `Overall session score:`;

  // auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [step, messages, extraMsgs, aiReplying]);

  // Step sequencer
  useEffect(() => {
    const delays = {
      0: 0,       // msg1 starts immediately
      1: 1500,    // typing before msg2
      3: 1000,    // typing before chart
      5: 1500,    // typing before msg4
      7: 1500,    // typing before tips
      9: 1500,    // typing before score
    };
    if (delays[step] !== undefined) {
      // These steps show a typing indicator before advancing
    }
  }, []);

  const advance = () => setStep(s => s + 1);

  const handleSend = async () => {
    const text = inputVal.trim();
    if (!text || aiReplying) return;
    setInputVal("");
    const userMsg = { role: "user", text };
    setExtraMsgs(prev => [...prev, userMsg]);
    setAiReplying(true);

    const reply = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert AI physical therapist specializing in ACL rehabilitation. The patient just completed ${exerciseName}. Their metrics were: hip flexion ${metrics.hip}°, symmetry ${metrics.sym}%, reps ${metrics.reps}. Respond in 2-3 sentences, be encouraging but specific and clinical. Never recommend stopping rehab or seeing a doctor unless truly urgent.\n\nPatient question: ${text}`,
    });
    setAiReplying(false);
    setExtraMsgs(prev => [...prev, { role: "ai", text: typeof reply === "string" ? reply : reply?.text || "Keep up the great work!" }]);
  };

  const inputReady = step >= 11;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 600, background: T.bg,
      display: "flex", flexDirection: "column", fontFamily: font,
    }}>
      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
      `}</style>

      {/* Header */}
      <div style={{
        background: "rgba(8,8,8,0.96)", backdropFilter: "blur(24px)",
        borderBottom: `1px solid ${T.border}`, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
      }}>
        <button onClick={onDone} style={{
          background: T.grayD, border: `1px solid ${T.border}`, borderRadius: 99,
          padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", color: T.gray,
        }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: T.white }}>AI Coach Analysis</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, animation: "pulseDot 1.5s ease-in-out infinite" }} />
            <span style={{ color: T.green, fontSize: 11, fontWeight: 600 }}>Analyzing your session...</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 8, padding: "5px 10px" }}>
          <TrendingUp size={13} color={T.green} />
          <span style={{ color: T.green, fontSize: 11, fontWeight: 700 }}>{exerciseName}</span>
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", paddingTop: 12, paddingBottom: 16 }}>

        {/* Message 1 */}
        {step >= 0 && (
          <TypewriterBubble text={msg1} showAvatar={true} onDone={() => { if (step === 0) setTimeout(advance, 400); }} />
        )}

        {/* Typing → Message 2 */}
        {step === 1 && <TypingDots />}
        {step >= 2 && (
          <TypewriterBubble text={msg2} showAvatar={true} onDone={() => { if (step === 2) setTimeout(advance, 400); }} />
        )}

        {/* Typing → Chart (msg3) */}
        {step === 3 && <TypingDots />}
        {step >= 4 && (
          <div style={{ padding: "6px 16px 6px 58px" }}>
            <MiniChart data={[72, 95, 108]} />
            {step === 4 && (() => { setTimeout(advance, 1200); return null; })()}
          </div>
        )}

        {/* Typing → Message 4 */}
        {step === 5 && <TypingDots />}
        {step >= 6 && (
          <TypewriterBubble text={msg4} showAvatar={true} onDone={() => { if (step === 6) setTimeout(advance, 400); }} />
        )}

        {/* Typing → Tips (msg5) */}
        {step === 7 && <TypingDots />}
        {step >= 8 && (
          <div style={{ padding: "6px 16px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <AIAvatar />
              <div style={{
                background: T.glass, border: `1px solid ${T.glassBorder}`,
                borderRadius: "4px 16px 16px 16px", padding: "12px 14px", flex: 1,
              }}>
                <div style={{ color: T.white, fontSize: 14, marginBottom: 4 }}>{msg5prefix}</div>
                <TipCards />
              </div>
            </div>
            {step === 8 && (() => { setTimeout(advance, 1600); return null; })()}
          </div>
        )}

        {/* Typing → Score (msg6) */}
        {step === 9 && <TypingDots />}
        {step >= 10 && (
          <div style={{ padding: "6px 16px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <AIAvatar />
              <div style={{
                background: T.glass, border: `1px solid ${T.glassBorder}`,
                borderRadius: "4px 16px 16px 16px", padding: "12px 14px", flex: 1,
              }}>
                <div style={{ color: T.white, fontSize: 14, marginBottom: 4 }}>{msg6prefix}</div>
                <ScoreRing score={87} />
              </div>
            </div>
            {step === 10 && (() => { setTimeout(advance, 1800); return null; })()}
          </div>
        )}

        {/* Extra Q&A messages */}
        {extraMsgs.map((m, i) =>
          m.role === "user"
            ? <UserBubble key={i} text={m.text} />
            : <div key={i} style={{ padding: "6px 16px" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <AIAvatar />
                  <div style={{ background: T.glass, border: `1px solid ${T.glassBorder}`, borderRadius: "4px 16px 16px 16px", padding: "12px 14px", maxWidth: "85%", fontSize: 14, color: T.white, lineHeight: 1.6 }}>
                    {m.text}
                  </div>
                </div>
              </div>
        )}
        {aiReplying && <AIBubble content="" isTyping showAvatar />}
      </div>

      {/* Input bar */}
      {inputReady && (
        <div style={{
          borderTop: `1px solid ${T.border}`, background: "rgba(8,8,8,0.97)",
          backdropFilter: "blur(24px)", padding: "12px 16px",
          display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0,
        }}>
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask your AI coach anything..."
            style={{
              flex: 1, background: T.surface2, border: `1px solid ${T.border}`,
              borderRadius: 20, padding: "12px 16px", color: T.white,
              fontSize: 14, fontFamily: font, outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = T.greenBorder}
            onBlur={e => e.target.style.borderColor = T.border}
          />
          <button
            onClick={handleSend}
            disabled={!inputVal.trim() || aiReplying}
            style={{
              width: 44, height: 44, borderRadius: "50%", border: "none",
              background: inputVal.trim() && !aiReplying
                ? `linear-gradient(135deg, ${T.green}, ${T.greenDeep})`
                : T.grayD,
              cursor: inputVal.trim() && !aiReplying ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.2s",
              boxShadow: inputVal.trim() ? `0 0 14px ${T.greenGlow}` : "none",
            }}
          >
            <Send size={18} color={inputVal.trim() && !aiReplying ? "#fff" : T.gray} />
          </button>
        </div>
      )}

      {/* "Continue" when input isn't ready yet */}
      {!inputReady && step >= 0 && (
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${T.border}`, flexShrink: 0, background: "rgba(8,8,8,0.97)" }}>
          <div style={{ color: T.gray, fontSize: 12, textAlign: "center" }}>
            Analyzing your session data...
          </div>
        </div>
      )}

      {/* View Full Report CTA — appears when debrief is complete */}
      {inputReady && onViewReport && (
        <div style={{ padding: "0 16px 12px", flexShrink: 0, background: "rgba(8,8,8,0.97)" }}>
          <button
            onClick={onViewReport}
            style={{
              width: "100%", background: `linear-gradient(135deg, ${T.green}, ${T.greenDeep})`,
              border: "none", borderRadius: 14, padding: "14px 0", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: font, fontWeight: 800, fontSize: 15, color: "#fff",
              boxShadow: `0 4px 20px ${T.greenGlow}`,
            }}
          >
            <FileText size={18} /> View Full Session Report
          </button>
        </div>
      )}
    </div>
  );
}
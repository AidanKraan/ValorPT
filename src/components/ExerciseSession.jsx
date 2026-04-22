import { useState, useEffect, useRef } from "react";
import { X, Settings, Check } from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { getExerciseGifUrl } from "./ExerciseFigure";

const SKELETON_PAIRS = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];

function getAngle(A, B, C) {
  const AB = { x: A.x - B.x, y: A.y - B.y };
  const CB = { x: C.x - B.x, y: C.y - B.y };
  const dot = AB.x * CB.x + AB.y * CB.y;
  const magAB = Math.sqrt(AB.x ** 2 + AB.y ** 2);
  const magCB = Math.sqrt(CB.x ** 2 + CB.y ** 2);
  if (magAB === 0 || magCB === 0) return null;
  const cos = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  return Math.acos(cos) * (180 / Math.PI);
}

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
  @keyframes spin {
    to { transform: rotate(360deg); }
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

/* ─── Compact GIF demo (inline in session panel) ─── */
function DemoFigure({ exerciseName }) {
  const [failed, setFailed] = useState(false);
  const url = getExerciseGifUrl(exerciseName);

  if (!url || failed) {
    return (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#FFFFFF", fontSize: 14, fontWeight: 700, fontFamily: font,
        textAlign: "center", padding: 12,
      }}>
        {exerciseName || "Exercise"}
      </div>
    );
  }

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      borderRadius: 16, overflow: "hidden", background: "#000000",
    }}>
      <img
        src={url}
        alt={exerciseName}
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,200,83,0.07)",
        mixBlendMode: "color",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

/* ─── Real-time pose detection camera (MoveNet Lightning) ─── */
function PoseCamera({ countdown, onMetrics }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);
  const smoothedRef = useRef({ left: null, right: null });
  const [modelLoading, setModelLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [denied, setDenied] = useState(false);

  const drawSkeleton = (pose, canvas, video) => {
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";

    const byName = {};
    for (const kp of pose.keypoints) byName[kp.name] = kp;

    for (const [a, b] of SKELETON_PAIRS) {
      const ka = byName[a], kb = byName[b];
      if (!ka || !kb) continue;
      const conf = Math.min(ka.score ?? 0, kb.score ?? 0);
      if (conf > 0.5) {
        ctx.strokeStyle = "#00C853";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00C853";
      } else {
        ctx.strokeStyle = "#FF9500";
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.moveTo(ka.x, ka.y);
      ctx.lineTo(kb.x, kb.y);
      ctx.stroke();
    }

    for (const kp of pose.keypoints) {
      const hi = (kp.score ?? 0) > 0.5;
      if (hi) {
        ctx.fillStyle = "#00C853";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00C853";
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#FF9500";
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
  };

  const calculateAngles = (pose) => {
    const byName = {};
    for (const kp of pose.keypoints) byName[kp.name] = kp;

    const rightA = byName.right_hip && byName.right_knee && byName.right_ankle
      ? getAngle(byName.right_hip, byName.right_knee, byName.right_ankle) : null;
    const leftA = byName.left_hip && byName.left_knee && byName.left_ankle
      ? getAngle(byName.left_hip, byName.left_knee, byName.left_ankle) : null;

    const smooth = (prev, next) => next == null ? prev : (prev == null ? next : 0.8 * prev + 0.2 * next);
    smoothedRef.current.left = smooth(smoothedRef.current.left, leftA);
    smoothedRef.current.right = smooth(smoothedRef.current.right, rightA);

    onMetrics?.({
      left: smoothedRef.current.left,
      right: smoothedRef.current.right,
    });
  };

  /* Set up camera + load model once */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise(res => {
            if (videoRef.current.readyState >= 2) return res();
            videoRef.current.onloadedmetadata = () => res();
          });
          setCameraActive(true);
        }
      } catch (e) {
        if (!cancelled) setDenied(true);
        return;
      }

      try {
        await tf.ready();
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );
        if (cancelled) { detector.dispose(); return; }
        detectorRef.current = detector;
        setModelLoading(false);

        const detectPose = async () => {
          if (cancelled) return;
          const video = videoRef.current;
          const detector = detectorRef.current;
          if (!video || !detector || video.readyState < 2) {
            animFrameRef.current = requestAnimationFrame(detectPose);
            return;
          }
          try {
            const poses = await detector.estimatePoses(video);
            if (poses.length > 0) {
              drawSkeleton(poses[0], canvasRef.current, video);
              calculateAngles(poses[0]);
            }
          } catch {
            /* swallow per-frame errors; keep loop alive */
          }
          animFrameRef.current = requestAnimationFrame(detectPose);
        };

        animFrameRef.current = requestAnimationFrame(detectPose);
      } catch {
        /* model load failed — leave modelLoading true so spinner stays,
           but don't throw; camera still functions */
      }
    })();

    return () => {
      cancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      detectorRef.current?.dispose?.();
      detectorRef.current = null;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      position: "relative", width: "100%", flex: 1,
      borderRadius: 16, overflow: "hidden",
      background: "#0A0A0A",
      minHeight: 0,
    }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: "scaleX(-1)", display: "block",
          visibility: cameraActive ? "visible" : "hidden",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
          transform: "scaleX(-1)",
        }}
      />

      {!cameraActive && !denied && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#555", fontSize: 13, fontFamily: font }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid #222", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#333" }} />
          </div>
          Activating camera…
        </div>
      )}

      {denied && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#555", fontSize: 13, fontFamily: font }}>Camera permission denied</span>
        </div>
      )}

      {cameraActive && modelLoading && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 14, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            border: "3px solid rgba(0,200,83,0.2)",
            borderTopColor: "#00C853",
            animation: "spin 0.9s linear infinite",
          }} />
          <div style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 600, fontFamily: font, letterSpacing: 0.5 }}>
            Initializing AI…
          </div>
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


export default function ExerciseSession({ patient, exercise, onComplete, onBack }) {
  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(1);
  const [kneeL, setKneeL] = useState(null);
  const [kneeR, setKneeR] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const repPhaseRef = useRef("up"); // "up" = extended, "down" = flexed

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

  /* Rep detection from real knee angles: extended (>160°) → flexed (<120°) → extended = 1 rep */
  const handlePoseMetrics = ({ left, right }) => {
    setKneeL(left);
    setKneeR(right);
    if (countdown > 0) return;
    const active = right ?? left;
    if (active == null) return;
    if (repPhaseRef.current === "up" && active < 120) {
      repPhaseRef.current = "down";
    } else if (repPhaseRef.current === "down" && active > 160) {
      repPhaseRef.current = "up";
      setReps(r => Math.min(r + 1, TARGET_REPS));
    }
  };

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
        onComplete({ m: { knee: Math.round(kneeR ?? kneeL ?? 0), sym: 87, reps: TARGET_REPS }, exercise });
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
        <PoseCamera countdown={countdown} onMetrics={handlePoseMetrics} />

        {/* Knee angle HUD — bottom-left of camera feed */}
        {recording && (kneeL != null || kneeR != null) && (
          <div style={{
            position: "absolute", bottom: 10, left: 24, zIndex: 10,
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
            padding: "6px 10px",
            color: "#FFFFFF", fontFamily: font, fontSize: 11,
            fontVariantNumeric: "tabular-nums", lineHeight: 1.35,
          }}>
            <div style={{ color: "#A0A0A0", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Knee flexion
            </div>
            <div>L {kneeL != null ? Math.round(kneeL) : "—"}°&nbsp;&nbsp;R {kneeR != null ? Math.round(kneeR) : "—"}°</div>
          </div>
        )}

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
/* ══════════════════════════════════════════════════════════
   EXERCISE FIGURE — clean minimal panel
   No GIFs, videos, or iframes. Pure typography + progress dots.
══════════════════════════════════════════════════════════ */

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

const FIGURE_CSS = `
  @keyframes repPulse {
    0%, 100% { transform: scale(1);   opacity: 1;   box-shadow: 0 0 10px rgba(0,200,83,0.7); }
    50%      { transform: scale(1.25); opacity: 0.7; box-shadow: 0 0 18px rgba(0,200,83,1); }
  }
`;

const SETS_MAP = {
  "Lying Heel Slides":    "3 × 15 reps",
  "Seated Heel Slides":   "3 × 15 reps",
  "Straight Leg Raises":  "3 × 10 reps",
  "Long Arc Quad":        "3 × 15 reps",
  "Air Squats (60°)":     "3 × 12 reps",
  "Air Squats (30°)":     "3 × 12 reps",
  "Single Leg Squat 50%": "3 × 10 reps",
  "Single Leg Squat Max": "3 × 8 reps",
  "Step-Ups":             "3 × 12 reps",
  "Forward Lunges":       "3 × 10 reps",
};

const FIRST_CUES = {
  "Lying Heel Slides":    "Lie on your back with both legs extended and your operative heel resting on the surface.",
  "Seated Heel Slides":   "Sit upright in a chair with both feet flat on the floor, hip-width apart.",
  "Straight Leg Raises":  "Lie flat on your back with the non-operative leg bent, foot flat on the floor.",
  "Long Arc Quad":        "Sit on a chair with both knees bent at 90°.",
  "Air Squats (60°)":     "Stand with feet shoulder-width apart, toes slightly pointing outward.",
  "Air Squats (30°)":     "Stand with feet shoulder-width apart, arms extended forward for balance.",
  "Single Leg Squat 50%": "Stand on your operative leg, the other leg lifted slightly off the floor.",
  "Single Leg Squat Max": "Balance on the operative leg; the non-operative leg is lifted forward.",
  "Step-Ups":             "Stand facing a low step or platform with your operative leg on it.",
  "Forward Lunges":       "Stand tall with feet hip-width apart, arms at your sides.",
};

export function getExerciseSets(name) {
  return SETS_MAP[name] || "";
}

/*
  ExerciseFigure
  Props:
  - exerciseName (required)
  - reps         (optional) — number of reps completed in current set
  - totalReps    (optional) — total reps per set (for context)
  - sets         (optional override for "3 × 15 reps" label)
  - firstCue     (optional override for the italic coaching cue)
*/
export default function ExerciseFigure({
  exerciseName,
  reps = 0,
  totalReps = 3,
  sets,
  firstCue,
}) {
  const label = sets ?? SETS_MAP[exerciseName] ?? "";
  const cue = firstCue ?? FIRST_CUES[exerciseName] ?? "Perform each rep slowly with full control.";

  const DOT_COUNT = 3;
  const completed = Math.min(Math.floor((reps / Math.max(totalReps, 1)) * DOT_COUNT), DOT_COUNT);
  const isCurrent = (i) => i === completed && completed < DOT_COUNT;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "9/16",
      maxHeight: "75vh",
      background: "#000000",
      borderTop: "1px solid #00C853",
      borderRadius: 16,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 28,
      fontFamily: font,
    }}>
      <style>{FIGURE_CSS}</style>

      <div style={{
        color: "#FFFFFF",
        fontWeight: 700,
        fontSize: 24,
        textAlign: "center",
        letterSpacing: -0.3,
        lineHeight: 1.2,
        maxWidth: 420,
      }}>
        {exerciseName}
      </div>

      {label && (
        <div style={{
          color: "#A0A0A0",
          fontSize: 16,
          marginTop: 8,
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
        }}>
          {label}
        </div>
      )}

      <div style={{
        color: "#A0A0A0",
        fontSize: 14,
        fontStyle: "italic",
        marginTop: 12,
        textAlign: "center",
        maxWidth: 420,
        lineHeight: 1.45,
      }}>
        {cue}
      </div>

      {/* Rep progress — 3 dots */}
      <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
        {Array.from({ length: DOT_COUNT }).map((_, i) => {
          const filled = i < completed;
          const current = isCurrent(i);
          return (
            <div
              key={i}
              style={{
                width: 12, height: 12, borderRadius: "50%",
                background: filled
                  ? "#00C853"
                  : current
                    ? "#00C853"
                    : "rgba(255,255,255,0.12)",
                border: "none",
                boxShadow: filled ? "0 0 10px rgba(0,200,83,0.6)" : "none",
                animation: current ? "repPulse 1.1s ease-in-out infinite" : "none",
                transition: "background 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

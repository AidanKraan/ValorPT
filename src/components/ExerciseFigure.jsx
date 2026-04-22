import { useState } from "react";

/* ══════════════════════════════════════════════════════════
   GIF-BASED EXERCISE DEMONSTRATIONS
══════════════════════════════════════════════════════════ */

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

const GIF_MAP = {
  "Lying Heel Slides":    "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "Seated Heel Slides":   "https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif",
  "Straight Leg Raises":  "https://media.giphy.com/media/xT9IgG50Lg7russbD6/giphy.gif",
  "Long Arc Quad":        "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif",
  "Air Squats (60°)":     "https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif",
  "Air Squats (30°)":     "https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif",
  "Single Leg Squat 50%": "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif",
  "Single Leg Squat Max": "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif",
  "Step-Ups":             "https://media.giphy.com/media/xT9IgG50Lg7russbD6/giphy.gif",
  "Forward Lunges":       "https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif",
};

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

export function getExerciseGifUrl(exerciseName) {
  return GIF_MAP[exerciseName] || null;
}

export function getExerciseSets(exerciseName) {
  return SETS_MAP[exerciseName] || "";
}

/* Fallback dark card when GIF fails to load */
function FallbackCard({ exerciseName, sets }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#000000", color: "#FFFFFF",
      fontFamily: font, textAlign: "center", padding: 24,
    }}>
      <div style={{
        color: "#A0A0A0", fontSize: 10, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: 2, marginBottom: 10,
      }}>
        Demonstration
      </div>
      <div style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>
        {exerciseName}
      </div>
      {sets && (
        <div style={{ color: "#A0A0A0", fontSize: 14, marginTop: 6 }}>{sets}</div>
      )}
    </div>
  );
}

export default function ExerciseFigure({ exerciseName }) {
  const [failed, setFailed] = useState(false);
  const gifUrl = GIF_MAP[exerciseName];
  const sets = SETS_MAP[exerciseName] || "";

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "9/16",
      maxHeight: "75vh",
      background: "#000000",
      borderRadius: 16,
      overflow: "hidden",
    }}>
      {gifUrl && !failed ? (
        <img
          src={gifUrl}
          alt={exerciseName}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <FallbackCard exerciseName={exerciseName} sets={sets} />
      )}

      {/* Green tint overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,200,83,0.07)",
        mixBlendMode: "color",
        pointerEvents: "none",
      }} />

      {/* Scanline overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        pointerEvents: "none",
      }} />

      {/* Bottom gradient with label */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
        padding: 16,
        pointerEvents: "none",
      }}>
        <div style={{
          color: "#A0A0A0",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 2,
          fontFamily: font,
          fontWeight: 600,
        }}>
          Demonstration
        </div>
        <div style={{
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: font,
          marginTop: 2,
        }}>
          {exerciseName}
        </div>
        {sets && (
          <div style={{
            color: "#A0A0A0",
            fontSize: 14,
            fontFamily: font,
            marginTop: 2,
          }}>
            {sets}
          </div>
        )}
      </div>
    </div>
  );
}

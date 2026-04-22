import React from "react";

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

/**
 * ValorPT Logo — SVG recreation matching the brand identity.
 * 
 * Props:
 * - height: total height in px (default 32)
 * - showText: show "VALOR PT" wordmark (default true)
 * - darkBg: if true, "VALOR" text is white; if false, dark charcoal (default true)
 * - iconOnly: show only the icon, no text (default false)
 * - className: optional className
 */

function ValorIconSVG({ size = 48 }) {
  // The icon is a stylized human figure with arms raised in a V shape
  // Small circle at top (head), two curved sweeping lines (body/wings)
  // forming both a "V" and a celebrating person
  const id = `valor_grad_${size}`;
  const id2 = `valor_grad2_${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="45%" stopColor="#00C853" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient id={id2} x1="10" y1="10" x2="55" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
      </defs>
      {/* Head — small circle */}
      <circle cx="36" cy="7" r="6" fill={`url(#${id})`} />
      {/* Left sweeping wing/body — curves from upper-left sweeping down */}
      <path
        d="M32 16 C24 14, 10 20, 4 36 C8 28, 18 22, 30 26 Z"
        fill={`url(#${id2})`}
        opacity="0.92"
      />
      <path
        d="M28 26 C20 28, 8 40, 10 52 C14 42, 24 34, 34 36 Z"
        fill={`url(#${id2})`}
        opacity="0.82"
      />
      {/* Main checkmark/V stroke — thick, rounded */}
      <path
        d="M18 40 C22 48, 30 56, 36 60 C44 48, 52 32, 62 16"
        stroke={`url(#${id})`}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Highlight stroke on the right arm of the V */}
      <path
        d="M36 60 C42 50, 52 32, 62 16"
        stroke={`url(#${id2})`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  );
}

export function ValorIcon({ size = 48 }) {
  return <ValorIconSVG size={size} />;
}

export default function ValorLogo({
  height = 32,
  showText = true,
  darkBg = true,
  iconOnly = false,
  className = "",
  style = {},
}) {
  const iconSize = height;
  const textColor = darkBg ? "#FFFFFF" : "#1A1A2E";
  const fontSize = height * 0.42;

  if (iconOnly) {
    return (
      <div className={className} style={{ display: "inline-flex", alignItems: "center", ...style }}>
        <ValorIconSVG size={iconSize} />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: height * 0.15,
        ...(darkBg ? { filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" } : {}),
        ...style,
      }}
    >
      <ValorIconSVG size={iconSize} />
      {showText && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <span
            style={{
              fontFamily: font,
              fontWeight: 900,
              fontSize,
              color: textColor,
              letterSpacing: -0.5,
              lineHeight: 1,
            }}
          >
            VALOR
          </span>
          <span
            style={{
              fontFamily: font,
              fontWeight: 900,
              fontSize,
              color: "#00C853",
              letterSpacing: -0.5,
              lineHeight: 1,
            }}
          >
            PT
          </span>
        </div>
      )}
    </div>
  );
}
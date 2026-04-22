import { useState } from "react";
import logoSrc from "../assets/valorpt-logo.png";

function TextFallback({ height, style = {} }) {
  return (
    <span style={{
      display: "inline-block",
      color: "#0A0A0A",
      fontWeight: 900,
      letterSpacing: 1,
      fontSize: Math.round(height * 0.6),
      lineHeight: 1,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      ...style,
    }}>
      VALOR PT
    </span>
  );
}

function LogoImg({ height, style = {} }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <TextFallback height={height} style={style} />;
  return (
    <img
      src={logoSrc}
      alt="ValorPT"
      height={height}
      onError={() => setFailed(true)}
      style={{ height, width: "auto", objectFit: "contain", display: "block", ...style }}
    />
  );
}

/* Pill wrapper with white background to make the white logo look intentional */
function LogoPill({ height, padding = "8px 16px", borderRadius = 12, glow = false, style = {} }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: "#FFFFFF",
      borderRadius,
      padding,
      filter: glow ? "drop-shadow(0px 4px 20px rgba(0,200,83,0.3))" : "none",
      ...style,
    }}>
      <LogoImg height={height} />
    </div>
  );
}

/* ValorIcon — used as AI avatar (circular crop) */
export function ValorIcon({ size = 48 }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", background: "#FFFFFF",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {failed ? (
        <TextFallback height={Math.round(size * 0.5)} />
      ) : (
        <img
          src={logoSrc}
          alt="ValorPT"
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </div>
  );
}

/*
  ValorLogo — main component used throughout the app.
  Props:
  - height: logo image height in px
  - darkBg: if true, adds green glow (for splash/dark screens)
  - large: if true, uses bigger pill padding (for login screen)
  - navStyle: if true, minimal compact pill for nav bars
*/
export default function ValorLogo({ height = 32, darkBg = false, large = false, navStyle = false, style = {} }) {
  if (navStyle) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "#FFFFFF", borderRadius: 8, padding: "4px 10px", ...style,
      }}>
        <LogoImg height={height} />
      </div>
    );
  }

  return (
    <LogoPill
      height={height}
      padding={large ? "16px 32px" : "8px 16px"}
      borderRadius={large ? 20 : 12}
      glow={darkBg}
      style={style}
    />
  );
}

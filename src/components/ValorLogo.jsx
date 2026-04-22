const LOGO_URL = "https://i.imgur.com/TCSo4WN.png";

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
      <img
        src={LOGO_URL}
        alt="ValorPT"
        height={height}
        style={{ height, width: "auto", objectFit: "contain", display: "block" }}
      />
    </div>
  );
}

/* ValorIcon — used as AI avatar (circular crop) */
export function ValorIcon({ size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", background: "#FFFFFF",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <img
        src={LOGO_URL}
        alt="ValorPT"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
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
        <img src={LOGO_URL} alt="ValorPT" height={height} style={{ height, width: "auto", objectFit: "contain", display: "block" }} />
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
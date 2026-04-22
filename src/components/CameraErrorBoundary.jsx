import { Component } from "react";
import { Camera, RotateCw, X } from "lucide-react";

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

export default class CameraErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[CameraErrorBoundary]", error, info);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const onBack = this.props.onBack;

    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "#000000",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: font, padding: 24,
      }}>
        <div style={{
          width: "100%", maxWidth: 360,
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 28,
          textAlign: "center",
          boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,59,48,0.12)",
            border: "1px solid rgba(255,59,48,0.3)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 18,
          }}>
            <Camera size={28} color="#FF3B30" />
          </div>
          <div style={{
            color: "#FFFFFF", fontSize: 18, fontWeight: 800, marginBottom: 6,
          }}>
            Camera unavailable
          </div>
          <div style={{
            color: "#A0A0A0", fontSize: 14, lineHeight: 1.5, marginBottom: 22,
          }}>
            We couldn't start the camera or pose tracker. Check permissions and try again.
          </div>

          <button
            onClick={this.reset}
            style={{
              width: "100%", height: 48, borderRadius: 12,
              background: "linear-gradient(135deg, #00C853, #1B5E20)",
              color: "#FFFFFF", fontWeight: 700, fontSize: 15, fontFamily: font,
              border: "none", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginBottom: 10,
            }}
          >
            <RotateCw size={17} />
            Try Again
          </button>

          {onBack && (
            <button
              onClick={() => { this.reset(); onBack(); }}
              style={{
                width: "100%", height: 44, borderRadius: 12,
                background: "transparent",
                color: "#A0A0A0", fontWeight: 600, fontSize: 14, fontFamily: font,
                border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <X size={15} />
              Back
            </button>
          )}
        </div>
      </div>
    );
  }
}

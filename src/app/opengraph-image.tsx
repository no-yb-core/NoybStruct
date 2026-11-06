import { ImageResponse } from "next/og";

export const alt =
  "Noyb Struct — Learn design patterns by solving real challenges";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(59,130,246,0.20) 0%, transparent 55%), radial-gradient(circle at 85% 85%, rgba(16,185,129,0.18) 0%, transparent 55%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "80px",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Brand lockup */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            N
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Noyb Struct
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            marginTop: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "86px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
              maxWidth: "1050px",
            }}
          >
            <span>Learn design patterns by</span>
            <span style={{ color: "#10b981", marginLeft: "20px" }}>
              solving challenges
            </span>
            <span>.</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              fontSize: "26px",
              color: "#a1a1aa",
              fontWeight: 500,
              marginTop: "8px",
            }}
          >
            <span>Workshop</span>
            <span>·</span>
            <span>Library</span>
            <span>·</span>
            <span>XP & Levels</span>
            <span>·</span>
            <span>Achievements</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
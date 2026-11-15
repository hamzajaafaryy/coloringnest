import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CraftColoring — Free Coloring Pages for Kids to Print";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff8ec 0%, #fff 52%, #f7efff 100%)",
          fontFamily: "Arial, sans-serif",
          color: "#2c2045",
        }}
      >
        <div style={{ position: "absolute", left: -80, top: -115, width: 360, height: 360, borderRadius: 180, background: "#ffe2a5", opacity: 0.65 }} />
        <div style={{ position: "absolute", right: -100, bottom: -150, width: 430, height: 430, borderRadius: 215, background: "#e7d5ff", opacity: 0.8 }} />
        <div style={{ position: "absolute", left: 72, top: 54, fontSize: 72 }}>☀️</div>
        <div style={{ position: "absolute", right: 88, top: 48, fontSize: 76 }}>🦕</div>
        <div style={{ position: "absolute", left: 95, bottom: 45, fontSize: 82 }}>🖍️</div>
        <div style={{ position: "absolute", right: 100, bottom: 35, fontSize: 88 }}>🦄</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 900, padding: "42px 52px", borderRadius: 42, background: "rgba(255,255,255,0.92)", border: "8px solid white", boxShadow: "0 24px 65px rgba(74,44,110,0.14)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 800, color: "#7b36c8" }}>
            <span>🎨</span><span>CraftColoring</span><span>🌈</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 22, padding: "22px 42px", borderRadius: 28, background: "linear-gradient(100deg, #7136bb, #a13bd2)", color: "white", width: "100%" }}>
            <div style={{ fontSize: 52, lineHeight: 1.12, fontWeight: 900, textAlign: "center" }}>Free Coloring Pages</div>
            <div style={{ marginTop: 8, fontSize: 42, lineHeight: 1.15, fontWeight: 800, color: "#ffe36b" }}>for Kids to Print</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, marginTop: 26, fontSize: 25, fontWeight: 800 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#7035b7" }}>🖨️ <span>Print</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#e52c87" }}>⬇️ <span>Download</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#579b18" }}>🖌️ <span>Color Online</span></div>
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 23, color: "#6b607b", fontWeight: 600 }}>A little creativity for every day</div>
        </div>
        <div style={{ position: "absolute", left: 395, top: 34, fontSize: 46 }}>⭐</div>
        <div style={{ position: "absolute", right: 380, bottom: 22, fontSize: 42 }}>✨</div>
      </div>
    ),
    size
  );
}

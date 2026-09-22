import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CraftColoring — Free Online Coloring Pages for Kids and Adults";
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)",
          color: "#0f172a",
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800 }}>
          CraftColoring
        </div>
        <div style={{ marginTop: 24, fontSize: 36 }}>
          Free Online Coloring Pages for Kids and Adults
        </div>
        <div style={{ marginTop: 32, fontSize: 24, color: "#475569" }}>
          Color online • Print • Download
        </div>
      </div>
    ),
    size
  );
}

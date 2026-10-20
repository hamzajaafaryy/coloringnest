import { sanitizeSvg } from "../sanitize-svg";

export function validateColoringSvg(content: string) {
  const svg = sanitizeSvg(content);
  if (!/<(?:path|rect|circle|ellipse|line|polyline|polygon)\b/i.test(svg)) {
    throw new Error("Use a vector SVG with paths or shapes, not a PNG/JPG wrapped inside an SVG file.");
  }
  return svg;
}

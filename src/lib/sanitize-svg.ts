const BLOCKED_TAGS = /<\/?(?:script|iframe|object|embed|foreignObject|audio|video|image)\b[^>]*>/gi;
const EVENT_ATTR = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const DANGEROUS_URL_ATTR = /\s+(?:href|xlink:href|src|action|formaction|baseProfile)\s*=\s*(?:"(?:https?:|javascript:|data:)[^"]*"|'(?:https?:|javascript:|data:)[^']*'|(?:https?:|javascript:|data:)[^\s>]+)/gi;
const STYLE_URL = /url\s*\(\s*['"]?(?:https?:|javascript:|data:)[^)]*\)/gi;

export function sanitizeSvg(svg: string) {
  if (!svg.trim()) return "";

  let safe = svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(BLOCKED_TAGS, "")
    .replace(EVENT_ATTR, "")
    .replace(DANGEROUS_URL_ATTR, "")
    .replace(STYLE_URL, "");

  safe = safe.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (block) =>
    block.replace(/@import[^;]+;?/gi, "").replace(/url\s*\([^)]*\)/gi, "")
  );

  if (!/<svg\b[^>]*>/i.test(safe)) {
    throw new Error("Invalid SVG: root <svg> element is required.");
  }

  return safe;
}

export function validateSvg(svg: string) {
  try {
    return sanitizeSvg(svg);
  } catch {
    return null;
  }
}

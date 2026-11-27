const BLOCKED_TAGS = /<\/?(?:script|iframe|object|embed|foreignObject|audio|video|image)\b[^>]*>/gi;
const EVENT_ATTR = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const STYLE_ATTR = /\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const STYLE_BLOCK = /<style\b[^>]*>[\s\S]*?<\/style\s*>/gi;
const HREF_ATTR = /\s+(xlink:)?href\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const URL_FUNCTION = /url\s*\(\s*(['"]?)(.*?)\1\s*\)/gi;

function attributeValue(raw: string) {
  return raw.length >= 2 && (raw[0] === '"' || raw[0] === "'")
    ? raw.slice(1, -1)
    : raw;
}

function keepInternalHref(_match: string, xlink: string | undefined, raw: string) {
  const value = attributeValue(raw);
  // Only same-document fragment references are allowed. This also rejects
  // entity-encoded, whitespace-prefixed, data: and protocol-relative URLs.
  if (!/^#[A-Za-z_][A-Za-z0-9_.:-]*$/.test(value)) return "";
  return ` ${xlink ? "xlink:" : ""}href="${value}"`;
}

function removeExternalUrlAttributes(_match: string, raw: string) {
  const value = attributeValue(raw);
  const urls = [...value.matchAll(URL_FUNCTION)];
  return urls.some((entry) => !String(entry[2] || "").trim().startsWith("#"))
    ? ""
    : _match;
}

export function sanitizeSvg(svg: string) {
  if (!svg.trim()) return "";

  let safe = svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(STYLE_BLOCK, "")
    .replace(BLOCKED_TAGS, "")
    .replace(EVENT_ATTR, "")
    .replace(STYLE_ATTR, "")
    .replace(HREF_ATTR, keepInternalHref);

  // Reject external resource loads in SVG presentation attributes such as
  // fill, stroke, filter, mask and clip-path; local url(#id) references remain.
  safe = safe.replace(
    /\s+[a-z][a-z0-9:_.-]*\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
    removeExternalUrlAttributes
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

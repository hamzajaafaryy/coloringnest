// JSON-LD is embedded in an HTML script element. Escaping '<' stops content
// such as an article title from closing that element; JSON.parse is unchanged.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

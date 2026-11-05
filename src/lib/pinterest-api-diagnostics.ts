/**
 * Non-sensitive Pinterest API diagnostics.
 * Response messages are untrusted third-party content; restrict what we expose.
 */
export function grantedPinterestScopes(scope: string): string[] {
  const set = new Set(scope.split(/[\s,]+/).map(x => x.trim()).filter(x => /^[a-z_]+:(?:read|write|read_secret|write_secret)$/.test(x)));
  return [...set].sort();
}

export function pinterestApiFailure(status: number, path: string, data: unknown): string {
  const context = path === "/pins" ? "creating the Pin" : path.startsWith("/boards") ? "reading the Board" : path.startsWith("/oauth") ? "authorizing" : "accessing Pinterest";
  const details = (typeof data === "object" && data !== null && !Array.isArray(data)) ? data as Record<string, unknown> : {};
  const rawCode = typeof details.code === "number" && Number.isSafeInteger(details.code) && details.code >= 0 && details.code <= 999999 ? details.code : null;
  // Pinterest's API error is not an instruction, and must never expose token values.
  const raw = typeof details.message === "string" ? details.message : typeof details.error_description === "string" ? details.error_description : "";
  const filtered = raw
    .replace(/(?:pina|pinr|pinc)_[a-zA-Z0-9_\-]+/g, "[redacted]")
    .replace(/\b(?:Bearer|Basic)\s+[a-zA-Z0-9+\/=._-]+/gi, "[redacted]")
    .replace(/[<>\r\n]/g, " ")
    .replace(/[^a-zA-Z0-9 ()'".,;:_\/-]/g, "")
    .slice(0, 150).trim();
  const suffix = [rawCode !== null ? "code " + rawCode : "", filtered].filter(Boolean).join(": ");
  const info = suffix ? " (" + suffix + ")" : "";
  if (status === 401) return "Pinterest returned HTTP 401 while " + context + info + ". This does not prove your login expired. Check token health and pins:write permissions; Reconnect only if necessary.";
  if (status === 403) return "Pinterest refused permission while " + context + info + ". Check app access tier, OAuth scopes and Board ownership.";
  if (status === 429) return "Pinterest rate limit reached while " + context + ". Check your Trial API limits.";
  if (status >= 500) return "Pinterest is temporarily unavailable while " + context + ". Do not automatically retry; verify whether the Pin appeared.";
  return "Pinterest rejected the request while " + context + " (HTTP " + status + ")" + info + ".";
}

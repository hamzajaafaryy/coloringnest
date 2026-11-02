export function parsePage(value?: string | string[] | null): number {
  const raw = Array.isArray(value) ? "" : (value || "");
  if (!/^[1-9]\\d{0,3}$/.test(raw)) return 1;
  return Math.min(10000, Number(raw));
}
export function pageUrl(path: string, page: number, query?: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return suffix ? `${path}?${suffix}` : path;
}

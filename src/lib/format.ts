import { labels, type ShipmentStatus } from "./types";
export function mad(value: number | string | null | undefined) {
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 2 }).format(Number(value ?? 0));
}
export function shortDate(value: string | null | undefined) {
  return value ? new Intl.DateTimeFormat("fr-MA", {dateStyle:"medium",timeStyle:"short"}).format(new Date(value)) : "—";
}
export function statusText(v: string) { return labels[v as ShipmentStatus] || v; }
export function statusClass(v: string) { return "tag status-" + v; }
export function csvSafe(value: unknown) {
  const s = String(value ?? "");
  const escaped = /^[\s]*[=+@\-\t\r]/.test(s) ? "'" + s : s;
  return '"' + escaped.replaceAll('"', '""') + '"';
}

export const DEFAULT_SITE_ORIGIN = "https://coloringnest.vercel.app";

export function resolveSiteOrigin(configured?: string): string {
  const url = new URL(configured?.trim() || DEFAULT_SITE_ORIGIN);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username || url.password || url.search || url.hash ||
    url.pathname.replace(/\/+$/, "")
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an http(s) origin without a path, query, or credentials.");
  }
  return url.origin;
}

export function canonicalSiteUrl(path: string, origin: string): string {
  const url = new URL(path || "/", `${origin}/`);
  if (url.origin !== origin) throw new Error("Canonical URLs must use the configured site origin.");
  const pathname = url.pathname.replace(/\/+$/, "");
  return `${origin}${pathname}`;
}

// Opt in only after the new domain is attached and HTTPS works. Host matching
// prevents redirects on preview deployments and excludes the destination host.
export function siteRedirectRules(origin: string, configuredHosts = "") {
  const destinationHost = new URL(origin).host.toLowerCase();
  return [...new Set(configuredHosts.split(",").map(host => host.trim().toLowerCase()).filter(Boolean))]
    .filter(host => host !== destinationHost)
    .map(host => {
      if (!/^[a-z0-9.-]+(?::\d{1,5})?$/.test(host)) {
        throw new Error("SITE_REDIRECT_FROM_HOSTS must contain comma-separated hostnames, without URLs or paths.");
      }
      return {
        source: "/:path*",
        has: [{ type: "host" as const, value: host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }],
        destination: `${origin}/:path*`,
        permanent: true,
      };
    });
}

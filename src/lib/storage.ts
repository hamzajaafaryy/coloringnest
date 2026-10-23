import { coloringImagePaths } from "./coloring-image-assets";

const BUCKET = "coloring-pages";

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

export async function deleteCraftColoringStorageUrl(fileUrl: string | null | undefined) {
  if (!fileUrl) return;
  const config = getConfig();
  if (!config) return;

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  let path: string;
  try {
    const parsed = new URL(fileUrl);
    if (parsed.origin !== new URL(config.url).origin || !parsed.pathname.startsWith(marker)) return;
    path = decodeURIComponent(parsed.pathname.slice(marker.length));
    if (!path || path.split("/").some(segment => segment === "." || segment === "..")) return;
  } catch { return; }

  await Promise.all(coloringImagePaths(path).map(async assetPath => {
    const response = await fetch(`${config.url}/storage/v1/object/${BUCKET}/${assetPath}`, {
      method: "DELETE",
      headers: { apikey: config.serviceRoleKey, Authorization: `Bearer ${config.serviceRoleKey}` },
      cache: "no-store",
    });
    if (!response.ok && response.status !== 404) {
      console.error("CraftColoring storage cleanup failed:", await response.text());
    }
  }));
}

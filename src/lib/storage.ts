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
  const index = fileUrl.indexOf(marker);
  if (index === -1) return;

  const path = decodeURIComponent(fileUrl.slice(index + marker.length));
  if (!path) return;

  const response = await fetch(
    `${config.url}/storage/v1/object/${BUCKET}/${path}`,
    {
      method: "DELETE",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok && response.status !== 404) {
    const message = await response.text();
    console.error("CraftColoring storage cleanup failed:", message);
  }
}

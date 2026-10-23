// Versioned asset families keep old image URLs working without a database migration.
const FAMILY = /^(images\/optimized-v1\/[a-z0-9-]+\/(\d+)x(\d+))\/print\.png$/;
const STORAGE_MARKER = "/storage/v1/object/public/coloring-pages/";

export function coloringImagePaths(path: string) {
  const match = FAMILY.exec(path);
  return match
    ? [`${match[1]}/print.png`, `${match[1]}/preview.webp`, `${match[1]}/thumbnail.webp`]
    : [path];
}

export function getColoringImageAssets(imageUrl: string) {
  const fallback = {
    printUrl: imageUrl,
    previewUrl: imageUrl,
    thumbnailUrl: imageUrl,
    srcSet: undefined as string | undefined,
    width: undefined as number | undefined,
    height: undefined as number | undefined,
    thumbnailWidth: undefined as number | undefined,
    thumbnailHeight: undefined as number | undefined,
  };

  let url: URL;
  try { url = new URL(imageUrl); } catch { return fallback; }
  if (!["http:", "https:"].includes(url.protocol)) return fallback;
  const marker = url.pathname.indexOf(STORAGE_MARKER);
  if (marker !== 0) return fallback;
  const match = FAMILY.exec(url.pathname.slice(STORAGE_MARKER.length));
  if (!match) return fallback;
  const width = Number(match[2]);
  const height = Number(match[3]);
  if (width < 1 || width > 2550 || height < 1 || height > 3300) return fallback;

  const sibling = (name: string) => {
    const asset = new URL(url);
    asset.pathname = `${STORAGE_MARKER}${match[1]}/${name}`;
    return asset.href;
  };
  const previewWidth = Math.min(1200, width);
  const thumbnailWidth = Math.min(600, width);
  const previewUrl = sibling("preview.webp");
  const thumbnailUrl = sibling("thumbnail.webp");
  return {
    printUrl: imageUrl,
    previewUrl,
    thumbnailUrl,
    srcSet: previewWidth > thumbnailWidth
      ? `${thumbnailUrl} ${thumbnailWidth}w, ${previewUrl} ${previewWidth}w`
      : `${previewUrl} ${previewWidth}w`,
    width: previewWidth,
    height: Math.max(1, Math.round(height * previewWidth / width)),
    thumbnailWidth,
    thumbnailHeight: Math.max(1, Math.round(height * thumbnailWidth / width)),
  };
}

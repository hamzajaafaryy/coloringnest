import sharp, { type Sharp } from "sharp";

export type ImageProfile = "coloring" | "general";
export type PreparedImageFile = {
  name: string;
  contentType: string;
  data: Buffer;
  width: number;
  height: number;
};

/** Decode once, preserve every edge, and never enlarge raster source pixels. */
export async function prepareImage(input: Uint8Array, profile: ImageProfile = "general") {
  const image = sharp(input, { limitInputPixels: 40_000_000, failOn: "error" });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height || !["png", "jpeg", "webp"].includes(metadata.format || "")) {
    throw new Error("Use a valid PNG, JPG, or WebP image.");
  }
  if ((metadata.pages || 1) > 1) throw new Error("Use a still image rather than an animated image.");

  const resized = image.autoOrient().resize({
    width: profile === "coloring" ? 2550 : 1600,
    height: profile === "coloring" ? 3300 : 1600,
    fit: "inside",
    withoutEnlargement: true,
  }).toColourspace("srgb");

  if (profile === "general") {
    const { data, info } = await resized.webp({ lossless: true, effort: 4 })
      .timeout({ seconds: 20 }).toBuffer({ resolveWithObject: true });
    return { files: [{ name: "image.webp", contentType: "image/webp", data, width: info.width, height: info.height }], warning: undefined };
  }

  const normalized = await resized.flatten({ background: "#ffffff" }).removeAlpha().raw()
    .timeout({ seconds: 20 }).toBuffer({ resolveWithObject: true });
  const { width, height, channels } = normalized.info;
  // Raw pixels carry no source EXIF/GPS. Only fresh print-density metadata is added.
  const pixels = () => sharp(normalized.data, { raw: { width, height, channels } });
  const encode = async (name: string, contentType: string, pipeline: Sharp): Promise<PreparedImageFile> => {
    const { data, info } = await pipeline.timeout({ seconds: 20 }).toBuffer({ resolveWithObject: true });
    return { name, contentType, data, width: info.width, height: info.height };
  };
  const files = await Promise.all([
    encode("print.png", "image/png", pixels().withMetadata({ density: 300 }).png({ compressionLevel: 9 })),
    encode("preview.webp", "image/webp", pixels().resize({ width: 1200, withoutEnlargement: true }).webp({ lossless: true, effort: 4 })),
    encode("thumbnail.webp", "image/webp", pixels().resize({ width: 600, withoutEnlargement: true }).webp({ lossless: true, effort: 4 })),
  ]);
  return {
    files,
    warning: width < 1200 ? "Small source image: kept at its original resolution. Use a larger image for sharper printing." : undefined,
  };
}

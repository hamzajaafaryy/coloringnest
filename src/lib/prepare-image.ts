import sharp, { type Sharp } from "sharp";

export type ImageProfile = "coloring" | "general";
export type PreparedImageFile = {
  name: string;
  contentType: string;
  data: Buffer;
  width: number;
  height: number;
};

const MIN_COLORING_EDGE = 1200;
const MIN_COLORING_PIXELS = 1_920_000;

/** Decode once, preserve every edge, and never enlarge raster source pixels. */
export async function prepareImage(input: Uint8Array, profile: ImageProfile = "general") {
  const image = sharp(input, { limitInputPixels: 40_000_000, failOn: "error" });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height || !["png", "jpeg", "webp"].includes(metadata.format || "")) {
    throw new Error("Use a valid PNG, JPG, or WebP image.");
  }
  if ((metadata.pages || 1) > 1) throw new Error("Use a still image rather than an animated image.");

  // EXIF orientations 5–8 rotate the displayed dimensions by 90 degrees.
  const rotated = [5, 6, 7, 8].includes(metadata.orientation || 1);
  const sourceWidth = rotated ? metadata.height : metadata.width;
  const sourceHeight = rotated ? metadata.width : metadata.height;

  if (profile === "coloring" &&
      (Math.min(sourceWidth, sourceHeight) < MIN_COLORING_EDGE ||
       sourceWidth * sourceHeight < MIN_COLORING_PIXELS)) {
    throw new Error(
      "This drawing is too small for a sharp printable page. Upload an original image at least 1200 × 1600 pixels (or 1600 × 1200 for landscape). Do not enlarge a small image."
    );
  }

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
  return { files, warning: undefined };
}

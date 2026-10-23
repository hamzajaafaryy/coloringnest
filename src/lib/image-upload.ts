export const MAX_IMAGE_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_IMAGE_SOURCE_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 40_000_000;
export const MAX_SVG_UPLOAD_BYTES = 2 * 1024 * 1024;
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

/** Prepare oversized files for the request-body limit; final encoding is server-side. */
export async function prepareImageFile(file: File) {
  if (!IMAGE_TYPES.includes(file.type) || !file.size) {
    throw new Error("Choose a PNG, JPG, or WebP image.");
  }
  if (file.size > MAX_IMAGE_SOURCE_BYTES) {
    throw new Error("Choose an image smaller than 20 MB.");
  }
  // Keep the original pixels and encoding whenever the file already fits the request.
  if (file.size <= MAX_IMAGE_UPLOAD_BYTES) return file;

  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) {
      throw new Error("Choose an image with no more than 40 million pixels.");
    }
    let scale = Math.min(1, 2550 / bitmap.width, 3300 / bitmap.height);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not prepare this image. Please try another file.");

    for (let attempt = 0; attempt < 8; attempt += 1) {
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      // PNG avoids another lossy pass on thin coloring outlines.
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Could not prepare this image. Please try another file.");
      if (blob.size <= MAX_IMAGE_UPLOAD_BYTES) {
        return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.png`, { type: "image/png" });
      }
      scale *= 0.8;
    }
    throw new Error("This image is still too large to upload. Please use a simpler or smaller image.");
  } finally {
    bitmap.close();
  }
}

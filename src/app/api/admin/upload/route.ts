import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { validateColoringSvg } from "@/lib/coloring/validateSvg";
import { MAX_IMAGE_UPLOAD_BYTES, MAX_SVG_UPLOAD_BYTES } from "@/lib/image-upload";
import { prepareImage, type PreparedImageFile } from "@/lib/prepare-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BUCKET = "coloring-pages";
const MAX_STORED_BYTES = 32 * 1024 * 1024;
const SUPPORTED_TYPES = new Set([
  "image/webp",
  "image/png",
  "image/jpeg",
  "image/svg+xml",
]);

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for image uploads."
    );
  }

  return { url, serviceRoleKey };
}

async function ensureBucket(url: string, serviceRoleKey: string) {
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };

  const listResponse = await fetch(`${url}/storage/v1/bucket`, {
    headers,
    cache: "no-store",
  });

  if (!listResponse.ok) {
    const message = await listResponse.text();
    throw new Error(`Could not check Supabase Storage buckets: ${message}`);
  }

  const buckets = (await listResponse.json()) as Array<{ id?: string; file_size_limit?: number | null }>;
  const existing = buckets.find((bucket) => bucket.id === BUCKET);

  if (existing) {
    // Older installations limited every stored object to 2 MB. Print PNGs can be larger.
    if (existing.file_size_limit != null && existing.file_size_limit < MAX_STORED_BYTES) {
      const updateResponse = await fetch(`${url}/storage/v1/bucket/${BUCKET}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ file_size_limit: MAX_STORED_BYTES }),
      });
      if (!updateResponse.ok) throw new Error("Could not update the image storage size limit.");
    }
    return;
  }

  const createResponse = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: MAX_STORED_BYTES,
      allowed_mime_types: [...SUPPORTED_TYPES],
    }),
  });

  if (!createResponse.ok) {
    const message = await createResponse.text();
    if (!message.toLowerCase().includes("already exists")) {
      throw new Error(`Could not create Supabase Storage bucket: ${message}`);
    }
  }
}

function hasValidMagic(bytes: Uint8Array, type: string) {
  if (type === "image/webp") {
    return (
      bytes.length >= 12 &&
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
    );
  }

  if (type === "image/png") {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }

  if (type === "image/jpeg") {
    return bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff;
  }

  if (type === "image/svg+xml") {
    return true;
  }

  return false;
}

function safeSegment(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "coloring-page"
  );
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { error: "Unauthorized. Your admin session has expired. Please log in again." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const slug = safeSegment(String(formData.get("slug") ?? "coloring-page"));
    const kind = formData.get("kind") === "svg" ? "svg" : "image";
    const profile = formData.get("profile") === "coloring" ? "coloring" : "general";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file selected." }, { status: 400 });
    }

    if (!SUPPORTED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Use WebP, PNG, JPG or SVG files only." },
        { status: 400 }
      );
    }

    if (kind === "svg" && file.type !== "image/svg+xml") {
      return NextResponse.json(
        { error: "The SVG upload must be an SVG file." },
        { status: 400 }
      );
    }

    if (kind === "image" && file.type === "image/svg+xml") {
      return NextResponse.json(
        { error: "Use a WebP, PNG or JPG file for the preview image." },
        { status: 400 }
      );
    }

    const maxBytes = kind === "svg" ? MAX_SVG_UPLOAD_BYTES : MAX_IMAGE_UPLOAD_BYTES;
    if (!file.size || file.size > maxBytes) {
      return NextResponse.json(
        { error: `Use a non-empty file smaller than ${maxBytes / 1024 / 1024} MB.` },
        { status: 413 }
      );
    }

    const originalBytes = new Uint8Array(await file.arrayBuffer());

    if (!hasValidMagic(originalBytes, file.type)) {
      return NextResponse.json(
        { error: "The file content does not match its declared image type." },
        { status: 400 }
      );
    }

    let bytes = originalBytes.buffer.slice(
      originalBytes.byteOffset,
      originalBytes.byteOffset + originalBytes.byteLength
    ) as ArrayBuffer;

    if (kind === "svg") {
      const svgText = new TextDecoder().decode(bytes);

      try {
        const sanitized = new TextEncoder().encode(validateColoringSvg(svgText));
        bytes = sanitized.buffer.slice(
          sanitized.byteOffset,
          sanitized.byteOffset + sanitized.byteLength
        ) as ArrayBuffer;
      } catch {
        return NextResponse.json(
          { error: "Use a valid vector SVG with drawable paths or shapes. Raster images wrapped in SVG are not supported." },
          { status: 400 }
        );
      }

      if (bytes.byteLength > MAX_SVG_UPLOAD_BYTES) {
        return NextResponse.json(
          { error: "Sanitized SVG is larger than 2 MB." },
          { status: 413 }
        );
      }
    }

    let files: PreparedImageFile[];
    let warning: string | undefined;
    if (kind === "svg") {
      files = [{ name: "image.svg", contentType: "image/svg+xml", data: Buffer.from(bytes), width: 0, height: 0 }];
    } else {
      try {
        ({ files, warning } = await prepareImage(originalBytes, profile));
      } catch {
        return NextResponse.json(
          { error: "Could not read this image. Use a still PNG, JPG, or WebP with no more than 40 million pixels." },
          { status: 400 }
        );
      }
    }
    if (files.some(asset => asset.data.byteLength > MAX_STORED_BYTES)) {
      return NextResponse.json({ error: "The prepared image is too large to store." }, { status: 413 });
    }

    const id = `${slug}-${randomUUID()}`;
    const prefix = kind === "svg" ? "svg" : "images";
    const paths = kind === "image" && profile === "coloring"
      ? files.map(asset => `images/optimized-v1/${id}/${files[0].width}x${files[0].height}/${asset.name}`)
      : files.map(asset => `${prefix}/${id}.${asset.name.split(".").pop()}`);
    const { url, serviceRoleKey } = getSupabaseConfig();
    await ensureBucket(url, serviceRoleKey);
    const headers = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` };
    const uploaded: string[] = [];
    try {
      for (const [index, asset] of files.entries()) {
        const body = asset.data.buffer.slice(asset.data.byteOffset, asset.data.byteOffset + asset.data.byteLength) as ArrayBuffer;
        const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${paths[index]}`, {
          method: "POST",
          headers: { ...headers, "Content-Type": asset.contentType, "Cache-Control": "public, max-age=31536000, immutable" },
          body,
        });
        if (!response.ok) throw new Error(`Image storage upload failed (HTTP ${response.status}).`);
        uploaded.push(paths[index]);
      }
    } catch (error) {
      // A failed variant must not leave an incomplete family or a successful URL.
      await Promise.allSettled(uploaded.map(path => fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, { method: "DELETE", headers })));
      throw error;
    }
    const publicUrl = (path: string) => `${url}/storage/v1/object/public/${BUCKET}/${path}`;
    return NextResponse.json({
      url: publicUrl(paths[0]),
      path: paths[0],
      size: files[0].data.byteLength,
      width: files[0].width || undefined,
      height: files[0].height || undefined,
      previewUrl: paths[1] ? publicUrl(paths[1]) : undefined,
      thumbnailUrl: paths[2] ? publicUrl(paths[2]) : undefined,
      warning,
    });
  } catch (error) {
    console.error("Admin upload error:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    );
  }
}

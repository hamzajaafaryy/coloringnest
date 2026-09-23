import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sanitizeSvg } from "@/lib/sanitize-svg";

const BUCKET = "coloring-pages";
const MAX_BYTES = 2 * 1024 * 1024;
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
    throw new Error("Could not check Supabase Storage buckets.");
  }

  const buckets = (await listResponse.json()) as Array<{ id?: string }>;
  if (buckets.some((bucket) => bucket.id === BUCKET)) return;

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
      file_size_limit: MAX_BYTES,
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

function safeSegment(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "coloring-page";
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const slug = safeSegment(String(formData.get("slug") ?? "coloring-page"));
    const kind = formData.get("kind") === "svg" ? "svg" : "image";

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

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Maximum allowed size is 2 MB." },
        { status: 413 }
      );
    }

    const { url, serviceRoleKey } = getSupabaseConfig();
    await ensureBucket(url, serviceRoleKey);

    let bytes = await file.arrayBuffer();
    if (kind === "svg") {
      const svgText = new TextDecoder().decode(bytes);
      try {
        bytes = new TextEncoder().encode(sanitizeSvg(svgText)).buffer;
      } catch {
        return NextResponse.json({ error: "Invalid or unsafe SVG file." }, { status: 400 });
      }
    }

    const extension =
      file.type === "image/svg+xml"
        ? "svg"
        : file.type === "image/webp"
          ? "webp"
          : file.type === "image/png"
            ? "png"
            : "jpg";

    const folder = kind === "svg" ? "svg" : "images";
    const path = `${folder}/${slug}-${Date.now()}.${extension}`;
    const uploadResponse = await fetch(
      `${url}/storage/v1/object/${BUCKET}/${path}`,
      {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": file.type,
          "x-upsert": "true",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
        body: bytes,
      }
    );

    if (!uploadResponse.ok) {
      const message = await uploadResponse.text();
      throw new Error(`Upload failed: ${message}`);
    }

    const publicUrl = `${url}/storage/v1/object/public/${BUCKET}/${path}`;
    return NextResponse.json({ url: publicUrl, path, size: bytes.byteLength });
  } catch (error) {
    console.error("Admin upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    );
  }
}

"use client";

import { useState } from "react";

const MAX_OUTPUT_BYTES = 1.5 * 1024 * 1024;

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function compressImage(file: File) {
  if (file.type === "image/svg+xml") return file;

  const bitmap = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare the image.");

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.82;
  let blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality)
  );

  while (blob && blob.size > MAX_OUTPUT_BYTES && quality > 0.5) {
    quality -= 0.08;
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
  }

  if (!blob) throw new Error("Could not compress the image.");

  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
    type: "image/webp",
  });
}

export function ImageUploadField({
  label,
  name,
  slugField = "slug",
  kind = "image",
  defaultValue = "",
  required = false,
}: {
  label: string;
  name: string;
  slugField?: string;
  kind?: "image" | "svg";
  defaultValue?: string | null;
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  async function handleChange(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setSelectedName(file.name);
    setStatus("Preparing file…");
    if (required) setUrl("");

    try {
      const prepared = kind === "image" ? await compressImage(file) : file;
      if (prepared.size > 2 * 1024 * 1024) {
        throw new Error("File is still larger than 2 MB. Choose a smaller file.");
      }

      const formData = new FormData();
      formData.append("file", prepared);
      formData.append("kind", kind);
      const slugInput = document.querySelector<HTMLInputElement>(`[name="${slugField}"]`);
      formData.append("slug", slugInput?.value || "coloring-page");

      setStatus("Uploading…");
      const response = await fetch("/api/admin/upload/", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) throw new Error(data.error || "Upload failed.");

      setUrl(data.url);
      setStatus(`Uploaded • ${formatBytes(prepared.size)}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input type="hidden" name={name} value={url} required={required} readOnly />
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <input
          type="file"
          accept={kind === "svg" ? "image/svg+xml,.svg" : "image/webp,image/png,image/jpeg"}
          disabled={uploading}
          onChange={(event) => void handleChange(event.target.files?.[0])}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-semibold file:text-indigo-700"
        />
        <p className="mt-2 text-xs text-slate-500">
          {kind === "image"
            ? "Images are automatically resized to max 1600px and converted to WebP. Target size: under 1.5 MB."
            : "SVG is kept as vector. Maximum file size: 2 MB."}
        </p>
        {selectedName && <p className="mt-2 truncate text-xs text-slate-500">Selected: {selectedName}</p>}
        {status && <p className="mt-2 text-xs font-medium text-slate-600">{status}</p>}
        {url && kind === "image" && (
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
            <img src={url} alt="Uploaded coloring page preview" className="max-h-48 w-auto object-contain" />
          </div>
        )}
        {url && (
          <p className="mt-3 break-all text-xs text-slate-400">{url}</p>
        )}
      </div>
    </div>
  );
}

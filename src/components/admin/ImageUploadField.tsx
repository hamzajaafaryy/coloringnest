"use client";

import { useState } from "react";
import { getColoringImageAssets } from "@/lib/coloring-image-assets";
import { MAX_IMAGE_UPLOAD_BYTES, MAX_SVG_UPLOAD_BYTES, prepareImageFile } from "@/lib/image-upload";

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ImageUploadField({
  label,
  name,
  slugField = "slug",
  kind = "image",
  profile = "general",
  defaultValue = "",
  required = false,
  onUploaded,
  onUploadingChange,
}: {
  label: string;
  name: string;
  slugField?: string;
  kind?: "image" | "svg";
  profile?: "general" | "coloring";
  defaultValue?: string | null;
  required?: boolean;
  onUploaded?: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  async function handleChange(file: File | undefined) {
    if (!file) return;

    setUploading(true);
    onUploadingChange?.(true);
    setSelectedName(file.name);
    setStatus("Preparing file…");
    try {
      const prepared = kind === "image" ? await prepareImageFile(file) : file;

      const maxBytes = kind === "svg" ? MAX_SVG_UPLOAD_BYTES : MAX_IMAGE_UPLOAD_BYTES;
      if (prepared.size > maxBytes) {
        throw new Error(`File is larger than ${maxBytes / 1024 / 1024} MB.`);
      }

      const formData = new FormData();
      formData.append("file", prepared);
      formData.append("kind", kind);
      formData.append("profile", profile);

      const slugInput = document.querySelector<HTMLInputElement>(
        `[name="${slugField}"]`
      );
      formData.append("slug", slugInput?.value || "coloring-page");

      setStatus("Uploading…");

      // Do not use a trailing slash here. It avoids an unnecessary POST redirect.
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
        cache: "no-store",
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
        size?: number;
        width?: number;
        height?: number;
        warning?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error || `Upload failed (HTTP ${response.status}).`);
      }

      setUrl(data.url);
      onUploaded?.(data.url);
      setStatus(`Uploaded${data.width && data.height ? ` • ${data.width} × ${data.height}` : ""} • ${formatBytes(data.size ?? prepared.size)}${data.warning ? ` • ${data.warning}` : ""}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  const assets = getColoringImageAssets(url);

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>

      <input aria-label={`${label} upload status`} className="sr-only" tabIndex={-1} required value={uploading || (required && !url) ? "" : "ready"} onChange={() => {}} />
      <input
        type="hidden"
        name={name}
        value={url}
        required={required}
        readOnly
      />

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <input
          type="file"
          aria-label={label}
          accept={kind === "svg" ? "image/svg+xml,.svg" : "image/webp,image/png,image/jpeg"}
          disabled={uploading}
          onChange={(event) => void handleChange(event.target.files?.[0])}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-semibold file:text-indigo-700"
        />

        <p className="mt-2 text-xs text-slate-500">
          {kind === "image"
            ? profile === "coloring"
              ? "Upload PNG, JPG or WebP up to 20 MB. Print and lighter web copies are prepared automatically, without cropping or stretching."
              : "Upload PNG, JPG or WebP up to 20 MB. Images are automatically fitted within 1600px without cropping or stretching."
            : "SVG is kept as vector. Maximum file size: 2 MB."}
        </p>

        {selectedName && (
          <p className="mt-2 truncate text-xs text-slate-500">
            Selected: {selectedName}
          </p>
        )}

        {status && (
          <p role="status" className="mt-2 text-xs font-medium text-slate-600">{status}</p>
        )}

        {url && kind === "image" && (
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
            <img
              src={assets.previewUrl}
              alt="Uploaded coloring page preview"
              width={assets.width}
              height={assets.height}
              className="max-h-48 w-auto object-contain"
            />
          </div>
        )}

        {url && (
          <p className="mt-3 break-all text-xs text-slate-400">{url}</p>
        )}
      </div>
    </div>
  );
}

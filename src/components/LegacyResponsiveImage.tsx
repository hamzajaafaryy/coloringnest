"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Use Vercel's cached WebP resizing on legacy raster images when available.
 * If an origin image fails to optimize (for example, a Hobby quota response),
 * fall back to the original public image instead of hiding the artwork.
 */
export default function LegacyResponsiveImage({
  src, alt, sizes, className, fill = false, width = 1200, height = 1553,
  loading = "lazy", fetchPriority = "auto",
}: {
  src: string;
  alt: string;
  sizes: string;
  className: string;
  fill?: boolean;
  width?: number;
  height?: number;
  quality?: number;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <img src={src} alt={alt} className={className}
      {...(!fill ? { width, height } : {})}
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : undefined}
      loading={loading} fetchPriority={fetchPriority} />;
  }
  const common = {
    src, alt, sizes, className, quality: 85 as const,
    loading, fetchPriority, onError: () => setFailed(true),
  };
  return fill
    ? <Image {...common} fill />
    : <Image {...common} width={width} height={height} />;
}

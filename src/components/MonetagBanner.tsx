"use client";

import { useEffect, useRef } from "react";

export default function MonetagBanner() {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || slot.querySelector('script[data-zone="12349031"]')) return;

    const script = document.createElement("script");
    script.dataset.zone = "12349031";
    script.src = "https://nap5k.com/tag.min.js";
    script.async = true;
    slot.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      ref={slotRef}
      aria-label="Advertisement"
      className="no-print my-6 flex min-h-[90px] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#e9dfef] bg-white"
    />
  );
}

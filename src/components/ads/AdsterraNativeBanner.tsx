"use client";

import { useEffect, useRef } from "react";

// Adsterra Native Banner: the ID of the target element must match the zone ID.
const SCRIPT_URL = "https://bauval.org/21/60c47e64f58f4578dcc40163f876e415";

export default function AdsterraNativeBanner() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // A Next.js client navigation mounts this element again, so reload the
    // provider script for the new banner container on that route.
    const script = document.createElement("script");
    script.async = true;
    script.src = SCRIPT_URL;
    script.setAttribute("data-cfasync", "false");
    host.appendChild(script);

    return () => {
      script.remove();
      host.replaceChildren();
    };
  }, []);

  return (
    <aside aria-label="Sponsored content" className="mx-auto my-10 w-full max-w-5xl px-4 sm:px-6">
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="mb-3 text-center text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
          Advertisement · Sponsored
        </p>
        <div ref={hostRef} className="min-h-[100px] w-full">
          <div id="container-60c47e64f58f4578dcc40163f876e415" />
        </div>
      </div>
    </aside>
  );
}

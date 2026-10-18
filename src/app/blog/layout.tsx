import type { ReactNode } from "react";
import Script from "next/script";
import AdsterraNativeBanner from "@/components/ads/AdsterraNativeBanner";

/**
 * Blog articles are directed at parents and teachers.
 * Only load the popunder for this section, not kids' games or coloring pages.
 */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AdsterraNativeBanner />
      <Script
        id="adsterra-popunder-blog"
        src="https://abscloud.org/1/22848fa2afe8c53f4b236e4489045815"
        strategy="afterInteractive"
        data-cfasync="false"
      />
    </>
  );
}

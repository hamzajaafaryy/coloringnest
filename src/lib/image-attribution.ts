/**
 * Attribution for artwork published under CraftColoring's own creative direction.
 * Do not apply to externally supplied images without verifying their rights.
 */
export function craftColoringImageAttribution(siteOrigin: string) {
  return {
    creator: {
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: "CraftColoring",
    },
    creditText: "Artwork by CraftColoring",
    copyrightNotice: "© 2026 CraftColoring. All rights reserved.",
  };
}

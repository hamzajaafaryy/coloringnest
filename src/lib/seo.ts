import type { Metadata } from "next";
import { getColoringImageAssets } from "./coloring-image-assets";
import { canonicalSiteUrl, resolveSiteOrigin } from "./site-urls";
export { serializeJsonLd } from "./structured-data";

const SITE_ROOT = resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL);

export const SITE_CONFIG = {
  name: "CraftColoring",
  tagline: "Free Online Coloring Pages for Kids and Adults",
  domain: SITE_ROOT,
  defaultTitle: "Free Coloring Pages for Kids & Adults | CraftColoring",
  defaultDescription:
    "Find free coloring pages for kids. Browse simple pictures, print them at home, and enjoy a little art time with crayons or pencils.",
  ogImage: `${SITE_ROOT}/opengraph-image`,
  twitterHandle: undefined,
};

export function buildCanonicalUrl(path: string): string {
  return canonicalSiteUrl(path, SITE_CONFIG.domain);
}

interface MetadataParams {
  title?: string;
  description?: string;
  path?: string;
  canonicalPath?: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
}

export function constructMetadata({
  title,
  description,
  path = "/",
  canonicalPath,
  image,
  noindex = false,
  type = "website",
}: MetadataParams = {}): Metadata {
  const cleanTitle = title?.replace(/(?:\s*\|\s*(?:ColoringNest|ColoringCraft|CraftColoring))+\s*$/gi, "").trim();
  const metaTitle = cleanTitle
    ? `${cleanTitle} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.defaultTitle;
  const metaDescription = description || SITE_CONFIG.defaultDescription;
  // Keep one preferred URL when a printable route mirrors a coloring page.
  const canonical = buildCanonicalUrl(canonicalPath ?? path);
  const imageAssets = image ? getColoringImageAssets(image) : null;
  const imageUrl = new URL(imageAssets?.previewUrl || SITE_CONFIG.ogImage, `${SITE_CONFIG.domain}/`).href;
  const imageDimensions = imageAssets?.width
    ? { width: imageAssets.width, height: imageAssets.height }
    : image ? {} : { width: 1200, height: 630 };

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(SITE_CONFIG.domain),
    ...(process.env.GOOGLE_SITE_VERIFICATION?.trim()
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION.trim() } }
      : {}),
    alternates: {
      canonical,
    },
    robots: noindex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          ...imageDimensions,
          alt: metaTitle,
        },
      ],
      type,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.domain}/#website`,
    name: SITE_CONFIG.name,
    alternateName: "CraftColoring",
    url: SITE_CONFIG.domain,
    publisher: { "@id": `${SITE_CONFIG.domain}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.domain}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/icon.svg`,
    description: SITE_CONFIG.defaultDescription,
  };
}

export interface BreadcrumbInputItem {
  label?: string;
  name?: string;
  href?: string;
  item?: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbInputItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const name = item.label || item.name || "";
      const path = item.href || item.item || "";
      const fullUrl = buildCanonicalUrl(path);

      return {
        "@type": "ListItem",
        position: index + 1,
        name,
        item: fullUrl,
      };
    }),
  };
}

export function generateImageObjectSchema({
  title,
  description,
  url,
  category,
  pageUrl,
}: {
  title: string;
  description: string;
  url: string;
  category: string;
  pageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    ...(pageUrl ? {
      "@id": `${buildCanonicalUrl(pageUrl)}#artwork`,
      mainEntityOfPage: { "@id": buildCanonicalUrl(pageUrl) },
    } : {}),
    contentUrl: new URL(url, `${SITE_CONFIG.domain}/`).href,
    thumbnailUrl: new URL(getColoringImageAssets(url).previewUrl, `${SITE_CONFIG.domain}/`).href,
    license: buildCanonicalUrl("/terms"),
    acquireLicensePage: buildCanonicalUrl("/terms"),
    name: title,
    caption: description,
    description,
    genre: category,
  };
}

export function generateCollectionPageSchema({
  title, description, path, items,
}: {
  title: string;
  description: string;
  path: string;
  items: { title: string; path: string; image?: string | null }[];
}) {
  const url = buildCanonicalUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_CONFIG.domain}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebPage",
          name: item.title,
          url: buildCanonicalUrl(item.path),
          ...(item.image ? { image: new URL(getColoringImageAssets(item.image).previewUrl, `${SITE_CONFIG.domain}/`).href } : {}),
        },
      })),
    },
  };
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleSchema({
  title,
  description,
  url,
  datePublished,
  authorName,
  image,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  authorName: string;
  image: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${buildCanonicalUrl(url)}#article`,
    url: buildCanonicalUrl(url),
    headline: title,
    description,
    image: new URL(image, `${SITE_CONFIG.domain}/`).href,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: {
      "@type": authorName === SITE_CONFIG.name ? "Organization" : "Person",
      name: authorName,
      ...(authorName === SITE_CONFIG.name ? { "@id": `${SITE_CONFIG.domain}/#organization` } : {}),
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.domain}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": buildCanonicalUrl(url),
    },
  };
}

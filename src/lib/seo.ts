import { normalizeBrand } from "@/lib/content-quality";
import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "CraftColoring",
  tagline: "Free Coloring Pages for Kids - Print or Color Online",
  domain: "https://craftcoloring.com",
  defaultTitle: "Free Coloring Pages for Kids - Print & Color Online | CraftColoring",
  defaultDescription:
    "Discover free coloring pages for kids to print or color online. Browse fun themes, classroom-friendly printables, and easy browser coloring tools for phones, tablets, and computers.",
  ogImage: "https://craftcoloring.com/opengraph-image",
  twitterHandle: undefined,
};

export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const trimmed = cleanPath === "/" ? "" : cleanPath.replace(/\/+$/, "");
  return `${SITE_CONFIG.domain}${trimmed}`;
}

interface MetadataParams {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  type?: "website" | "article";
}

export function constructMetadata({
  title,
  description,
  path = "/",
  image,
  imageAlt,
  noindex = false,
  type = "website",
}: MetadataParams = {}): Metadata {
  title = title ? normalizeBrand(title).replace(/\s*\|\s*CraftColoring(?: Blog)?$/i, "") : title;
  description = description ? normalizeBrand(description) : description;
  const suffix = ` | ${SITE_CONFIG.name}`;
  const cleanTitle = title?.endsWith(suffix)
    ? title.slice(0, -suffix.length)
    : title;

  const metaTitle = cleanTitle
    ? `${cleanTitle}${suffix}`
    : SITE_CONFIG.defaultTitle;

  const metaDescription = description || SITE_CONFIG.defaultDescription;
  const canonical = buildCanonicalUrl(path);
  const imageUrl = image || SITE_CONFIG.ogImage;
  const preferredImageAlt = imageAlt || cleanTitle || SITE_CONFIG.tagline;

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(SITE_CONFIG.domain),
    applicationName: SITE_CONFIG.name,
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.domain }],
    category: "Education",
    alternates: {
      canonical,
    },
    robots: noindex
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
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
          width: 1200,
          height: 630,
          alt: preferredImageAlt,
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
    name: SITE_CONFIG.name,
    alternateName: "Craft Coloring",
    url: SITE_CONFIG.domain,
    description: SITE_CONFIG.defaultDescription,
    inLanguage: "en-US",
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
      const fullUrl = path.startsWith("http")
        ? path
        : `${SITE_CONFIG.domain}${path.startsWith("/") ? "" : "/"}${path}`;

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
}: {
  title: string;
  description: string;
  url: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: url,
    url,
    license: `${SITE_CONFIG.domain}/terms/`,
    acquireLicensePage: `${SITE_CONFIG.domain}/terms/`,
    name: title,
    caption: description || title,
    description: description || title,
    genre: category,
    representativeOfPage: true,
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
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  authorName: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    ...(datePublished ? { datePublished } : {}),
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.domain}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

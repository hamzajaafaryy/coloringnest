import { Metadata } from "next";

export const SITE_CONFIG = {
  name: "CraftColoring",
  tagline: "Free Online Coloring Pages for Kids and Adults",
  domain: "https://craftcoloring.com",
  defaultTitle: "Free Coloring Pages for Kids & Adults | CraftColoring",
  defaultDescription: "Explore thousands of free printable coloring pages for kids and adults. Color online in your browser, download high-res PNG files, or print for free.",
  ogImage: "https://craftcoloring.com/images/og-default.jpg",
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
  noindex?: boolean;
  type?: "website" | "article";
}

export function constructMetadata({
  title,
  description,
  path = "/",
  image,
  noindex = false,
  type = "website",
}: MetadataParams = {}): Metadata {
  const metaTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.defaultTitle;
  const metaDescription = description || SITE_CONFIG.defaultDescription;
  const canonical = buildCanonicalUrl(path);
  const imageUrl = image || SITE_CONFIG.ogImage;

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(SITE_CONFIG.domain),
    alternates: {
      canonical: canonical,
    },
    robots: noindex
      ? { index: false, follow: true }
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
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      type: type,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
      creator: SITE_CONFIG.twitterHandle,
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    alternateName: ["CraftColoring", "CraftColoring Coloring Pages"],
    url: SITE_CONFIG.domain,
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
    logo: `${SITE_CONFIG.domain}/images/logo.png`,
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
        name: name,
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
    license: `${SITE_CONFIG.domain}/terms/`,
    acquireLicensePage: `${SITE_CONFIG.domain}/terms/`,
    name: title,
    caption: description,
    description: description,
    genre: category,
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
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
  datePublished: string;
  authorName: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.domain}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

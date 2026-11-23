import { makePinSeo, xmlEscape, type PinArtwork } from "./pinterest-studio";

export type PinterestFeedItem = PinArtwork & { publishedAt: Date | null };

export function buildPinterestRssFeed(items: PinterestFeedItem[], siteOrigin: string, builtAt = new Date()): string {
  const entries = items.map((item) => {
    const seo = makePinSeo(item, siteOrigin, "editorial");
    const imageUrl = new URL(`/api/pinterest/pin/${item.id}`, siteOrigin).toString();
    const pubDate = (item.publishedAt || builtAt).toUTCString();
    return `<item>
      <title>${xmlEscape(seo.title)}</title>
      <link>${xmlEscape(seo.destination)}</link>
      <guid isPermaLink="false">${xmlEscape(`craftcoloring-coloring-page-${item.id}`)}</guid>
      <pubDate>${xmlEscape(pubDate)}</pubDate>
      <description>${xmlEscape(seo.description)}</description>
      <enclosure url="${xmlEscape(imageUrl)}" type="image/png" length="0" />
      <media:content url="${xmlEscape(imageUrl)}" type="image/png" medium="image" />
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>CraftColoring – Free Printable Coloring Pages</title>
    <link>${xmlEscape(siteOrigin)}</link>
    <description>Free printable coloring pages for kids and adults from CraftColoring.</description>
    <language>en-us</language>
    <lastBuildDate>${builtAt.toUTCString()}</lastBuildDate>
    ${entries}
  </channel>
</rss>`;
}

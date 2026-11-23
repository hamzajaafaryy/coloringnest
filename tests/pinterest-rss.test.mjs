import test from "node:test";
import assert from "node:assert/strict";
import { buildPinterestRssFeed } from "../src/lib/pinterest-rss.ts";

const sample = {
  id: 42,
  title: "Cute Cat & Flowers",
  slug: "cute-cat-flowers",
  imageUrl: "https://storage.example.test/original.png",
  description: "A cute cat coloring page.",
  seoDescription: "Print this cute cat coloring page at home.",
  altText: "A cat beside flowers.",
  categoryName: "Animals",
  categorySlug: "animals",
  sheets: [],
  publishedAt: new Date("2026-11-01T12:00:00.000Z"),
};

test("Pinterest RSS emits RSS 2.0 and a generated vertical Pin image per item", () => {
  const xml = buildPinterestRssFeed([sample], "https://www.craftcoloring.com", new Date("2026-11-20T12:00:00.000Z"));
  assert.match(xml, /<rss version="2\.0"/);
  assert.match(xml, /xmlns:media="http:\/\/search\.yahoo\.com\/mrss\//);
  assert.match(xml, /<enclosure url="https:\/\/www\.craftcoloring\.com\/api\/pinterest\/pin\/42" type="image\/png"/);
  assert.match(xml, /<media:content url="https:\/\/www\.craftcoloring\.com\/api\/pinterest\/pin\/42" type="image\/png" medium="image"/);
  assert.match(xml, /<link>https:\/\/www\.craftcoloring\.com\/coloring-pages\/animals\/cute-cat-flowers\?/);
  assert.match(xml, /Cute Cat &amp; Flowers/);
  assert.match(xml, /<pubDate>Sun, 01 Nov 2026 12:00:00 GMT<\/pubDate>/);
});

test("Pinterest RSS escapes XML-sensitive text and supports an empty feed", () => {
  const xml = buildPinterestRssFeed([{ ...sample, title: 'Birds < & "Friends"' }], "https://www.craftcoloring.com");
  assert.match(xml, /Birds &lt; &amp; &quot;Friends&quot;/);
  assert.doesNotMatch(xml, /Birds < &/);
  const empty = buildPinterestRssFeed([], "https://www.craftcoloring.com");
  assert.match(empty, /<channel>/);
  assert.doesNotMatch(empty, /<item>/);
});

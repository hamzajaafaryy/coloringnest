import test from "node:test";
import assert from "node:assert/strict";
import { makePinSeo, pinBoard, wrapPinHeadline, xmlEscape, safePinName } from "../src/lib/pinterest-studio.ts";

const page = {
  id: 7, title: "Cute Little Princess Cat Coloring Page", slug: "cute-princess-cat-coloring",
  categoryName: "Princess", categorySlug: "princess",
  imageUrl: "https://example.com/cat.png",
  description: "A little cat wears a crown.", seoDescription: "A sweet princess cat awaits your crayons.",
  altText: "Black and white princess cat wearing a crown.",
  sheets: [{id:"sheet-2", title:"Princess Cat Meets a Puppy", altText:"Cat and puppy beside a castle.", imageUrl:"https://example.com/sheet2.png"}],
};
test("Pinterest SEO is grounded, valid, canonical and tracks organic traffic", () => {
  const result = makePinSeo(page, "https://www.craftcoloring.com", "lilac");
  assert.ok(result.title.length <= 100);
  assert.ok(result.description.length <= 500);
  assert.ok(result.altText.length <= 500);
  assert.equal(result.board, "Princess & Fairy Tale Coloring Pages");
  assert.match(result.destination, /^https:\/\/www\.craftcoloring\.com\/coloring-pages\/princesses\/cute-princess-cat-coloring\?/);
  assert.match(result.destination, /utm_source=pinterest/);
  assert.match(result.description, /princess cat/i);
});
test("collection sheets have unique descriptions and attribution", () => {
  const result = makePinSeo(page, "https://www.craftcoloring.com", "editorial", "sheet-2");
  assert.match(result.altText, /puppy/);
  assert.match(result.headline, /Puppy/);
  assert.match(result.destination, /sheet-2/);
});
test("header wrappers escape untrusted text and retain a readable headline", () => {
  const title = "Cute Princess Cat with Flowers and a Beautiful Big Crown Coloring Page";
  const lines = wrapPinHeadline(title, 23, 3);
  assert.ok(lines.length <= 3);
  assert.ok(lines.every(x => x.length > 0));
  assert.equal(xmlEscape('<script>alert("x") &</script>'), '&lt;script&gt;alert(&quot;x&quot;) &amp;&lt;/script&gt;');
  assert.equal(safePinName({...page,slug:"../weird!*"}, "lilac"), "craftcoloring----weird---cover-lilac.png");
  assert.equal(pinBoard("Dinosaur"), "Dinosaur Coloring Pages");
});

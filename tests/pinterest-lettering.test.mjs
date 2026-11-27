import test from "node:test";
import assert from "node:assert/strict";
import { letterPaths, titleLetterPaths } from "../src/lib/pinterest-lettering.ts";

test("all Pinterest wording is converted into font-independent vector outlines", () => {
  const headline = titleLetterPaths("Cozy Ghost Reading a Book Coloring Page", "#FFFFFF");
  const badge = letterPaths("PRINTABLE COLORING PAGE", { x: 500, y: 97, fontSize: 23, maxWidth: 420, color: "#FFFFFF", align: "center" });
  const footer = letterPaths("FREE TO PRINT", { x: 270, y: 1391, fontSize: 20, maxWidth: 310, color: "#FFFFFF", align: "center" });
  for (const html of [headline, badge, footer]) {
    assert.ok((html.match(/<path /g) || []).length > 10, "must contain actual letter outlines");
    assert.ok(!html.includes("<text"), "no platform-dependent SVG text nodes");
    assert.ok(!html.includes("font-family"), "no dependency on installed fonts");
    assert.ok(html.includes("scale("));
  }
  const opts = { x: 0, y: 0, fontSize: 30, maxWidth: 300, color: "#000" };
  assert.equal(letterPaths("&", opts), letterPaths("AND", opts));
  assert.equal(letterPaths("'", opts), letterPaths("’", opts));
  assert.notEqual(letterPaths("?", opts), letterPaths("-", opts));
});

test("long headlines fit the two-line title area with a readable fallback", () => {
  const path = titleLetterPaths(
    "Beautiful Magical Princess with a Flower Crown in a Secret Castle Garden Coloring Page",
    "#51306F",
  );
  assert.ok((path.match(/<path /g) || []).length > 30);
  assert.equal((path.match(/<g /g) || []).length, 4);
  assert.match(path, /fill="#062F36"/);
  assert.match(path, /fill="#51306F"/);
});

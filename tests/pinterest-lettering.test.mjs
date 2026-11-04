import test from "node:test";
import assert from "node:assert/strict";
import { letterPaths, titleLetterPaths } from "../src/lib/pinterest-lettering.ts";

test("all Pinterest wording is converted into font-independent vector outlines", () => {
  const headline = titleLetterPaths("Cozy Ghost Reading a Book Coloring Page", "#FFFFFF");
  const badge = letterPaths("FREE PRINTABLE", { x: 500, y: 83, fontSize: 23, maxWidth: 380, color: "#FFFFFF", align: "center" });
  const footer = letterPaths("FREE TO PRINT · FUN TO COLOR", { x: 72, y: 1460, fontSize: 19, maxWidth: 470, color: "#FFFFFF" });
  for (const html of [headline, badge, footer]) {
    assert.ok((html.match(/<path /g) || []).length > 10, "must contain actual letter outlines");
    assert.ok(!html.includes("<text"), "no platform-dependent SVG text nodes");
    assert.ok(!html.includes("font-family"), "no dependency on installed fonts");
    assert.ok(html.includes("scale("));
  }
  // A middle dot is a real font glyph; it should not silently fall back to '?'
  assert.notEqual(
    letterPaths("·", { x: 0, y: 0, fontSize: 30, maxWidth: 300, color: "#000" }),
    letterPaths("?", { x: 0, y: 0, fontSize: 30, maxWidth: 300, color: "#000" }),
  );
});

test("long headlines stay within the image's title area", () => {
  const path = titleLetterPaths(
    "Beautiful Magical Princess with a Flower Crown in a Secret Castle Garden Coloring Page",
    "#51306F",
  );
  assert.ok((path.match(/<path /g) || []).length > 30);
  assert.equal((path.match(/<g /g) || []).length, 3);
});

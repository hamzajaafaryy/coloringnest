import test from "node:test";
import assert from "node:assert/strict";
import { craftColoringImageAttribution } from "../src/lib/image-attribution.ts";

test("artwork attribution describes the actual organization, not a fictional individual", () => {
  const origin = "https://www.craftcoloring.com";
  const credit = craftColoringImageAttribution(origin);
  assert.deepEqual(credit.creator, {
    "@type": "Organization", "@id": origin + "/#organization", name: "CraftColoring",
  });
  assert.equal(credit.creditText, "Artwork by CraftColoring");
  assert.equal(credit.copyrightNotice, "© 2026 CraftColoring. All rights reserved.");
  assert.ok(!JSON.stringify(credit).includes("Anna Bloom"));
});

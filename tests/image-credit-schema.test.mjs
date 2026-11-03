import test from "node:test";
import assert from "node:assert/strict";
import { generateImageObjectSchema, generateColoringCreativeWorkSchema } from "../src/lib/seo.ts";

test("image credits are explicit, brand-owned, and link to the real organization", () => {
  const image = generateImageObjectSchema({
    title: "Sitting Monkey Coloring Page",
    description: "A smiling monkey waiting for crayons.",
    url: "https://images.example.com/print.png",
    category: "Animals",
    pageUrl: "/coloring-pages/animals/sitting-monkey",
  });
  assert.equal(image.creditText, "Artwork by CraftColoring");
  assert.equal(image.copyrightNotice, "© 2026 CraftColoring. All rights reserved.");
  assert.equal(image.creator["@type"], "Organization");
  assert.equal(image.creator.name, "CraftColoring");
  assert.equal(image.creator["@id"], image.creator["@id"].replace(/#organization$/, "#organization"));
  assert.equal("Person" in image.creator, false);
});
test("creative work creator references the same organization, not the mascot", () => {
  const data = generateColoringCreativeWorkSchema({
    title: "Cat Coloring Page", description: "A cat", path: "/coloring-pages/animals/cat",
    category: "Animals", ageRange: "Suggested ages 4–8",
  });
  assert.match(data.creator["@id"], /#organization$/);
  assert.equal(data.typicalAgeRange, "4-8");
});

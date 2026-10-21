import test from "node:test";
import assert from "node:assert/strict";
import { buildNameSheet, layoutName, MAX_NAME_LENGTH, NAME_THEMES, nameSheetDimensions, nameSheetFilename, validateColoringName } from "../src/lib/name-coloring.ts";

const defaults = { name: "SARA", theme: "butterflies", paper: "letter", tracing: false };

test("names preserve accents, punctuation and spaces while validating unsupported input", () => {
  assert.deepEqual(validateColoringName("  Élodie   Rose  "), { name: "Élodie Rose", error: "" });
  for (const name of ["HAMZA", "Jean-Pierre", "O’Connor", "O'NEIL", "E\u0301LODIE", "Ana María"]) {
    assert.equal(validateColoringName(name).error, "", name);
  }
  for (const name of ["", " ", "---", "😀", "سارة", '<img src="x">', "WWWWWWWWWWWWWWWWWWW"]) {
    assert.notEqual(validateColoringName(name).error, "", name);
    assert.throws(() => buildNameSheet({ ...defaults, name }));
  }
  assert.equal(validateColoringName("W".repeat(MAX_NAME_LENGTH)).error, "");
});

test("every theme creates a distinct self-contained printable vector with real letter paths", () => {
  const sheets = NAME_THEMES.map(theme => buildNameSheet({ ...defaults, theme: theme.id }));
  assert.equal(new Set(sheets).size, 4);
  for (const svg of sheets) {
    assert.match(svg, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.match(svg, /viewBox="0 0 850 1100"/);
    assert.match(svg, /data-name-row="SARA"/);
    assert.match(svg, /vector-effect="non-scaling-stroke"/);
    assert.ok((svg.match(/<path /g) || []).length > 10);
    assert.doesNotMatch(svg, /<(?:image|script|foreignObject|use|iframe)\b|\b(?:href|onload|onclick)=/i);
    assert.doesNotMatch(svg, /<text[^>]*>SARA<\/text>/);
    assert.match(svg, /SIL Open Font License/);
  }
});

test("short, long, accented and two-line names keep every outline inside the name frame", () => {
  for (const paper of ["letter", "a4"]) {
    const { width, height } = nameSheetDimensions(paper);
    for (const name of ["A", "ÉLODIE", "CHRISTOPHER", "JEAN-PIERRE", "O’CONNOR", "W".repeat(18), "ALEXANDER JAMES"]) {
      const rows = layoutName(name, width, height);
      for (const row of rows) {
        assert.ok(row.top >= height * .5 - 145, name);
        assert.ok(row.bottom <= height * .5 + 145, name);
        assert.ok(Number.isFinite(row.scale) && row.scale > 0, name);
        for (const { glyph, offset } of row.characters) {
          if (!glyph.path) continue;
          const left = row.x + (offset + glyph.xMin) * row.scale;
          const right = row.x + (offset + glyph.xMax) * row.scale;
          assert.ok(left > 69 && right < width - 69, `${paper}: ${name}`);
        }
      }
    }
  }
  assert.equal(layoutName("ALEXANDER JAMES", 850, 1100).length, 2);
});

test("paper size and tracing settings produce the requested sheet without mutating other sheets", () => {
  assert.deepEqual(nameSheetDimensions("letter"), { width: 850, height: 1100 });
  assert.deepEqual(nameSheetDimensions("a4"), { width: 827, height: 1169 });
  const plain = buildNameSheet(defaults);
  const traced = buildNameSheet({ ...defaults, paper: "a4", tracing: true });
  assert.match(traced, /viewBox="0 0 827 1169"/);
  assert.match(traced, /stroke-dasharray="5 4"/);
  assert.match(traced, /Trace your name/);
  assert.doesNotMatch(plain, /stroke-dasharray/);
  assert.equal(buildNameSheet(defaults), plain);
});

test("untrusted names and invalid design options cannot enter generated SVG markup", () => {
  const svg = buildNameSheet({ ...defaults, name: "O'NEIL" });
  assert.match(svg, /O&apos;NEIL/);
  assert.throws(() => buildNameSheet({ ...defaults, theme: '<script>alert(1)</script>' }));
  assert.throws(() => buildNameSheet({ ...defaults, paper: "unknown" }));
  assert.throws(() => buildNameSheet({ ...defaults, name: "SAR\u0000A" }));
});

test("download filenames stay readable and safe for accented and hyphenated names", () => {
  assert.equal(nameSheetFilename("Élodie Rose", "garden"), "elodie-rose-garden-coloring-page");
  assert.equal(nameSheetFilename("Jean-Pierre", "space"), "jean-pierre-space-coloring-page");
  assert.equal(nameSheetFilename("O'NEIL", "dinosaurs"), "o-neil-dinosaurs-coloring-page");
});

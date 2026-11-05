import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("OAuth routes do not eagerly import Sharp or libvips", async () => {
  const source = await readFile("src/lib/pinterest-publishing.ts", "utf8");
  const imports = source.split("const API = ")[0];
  assert.doesNotMatch(imports, /(?:import|require).*pinterest-render/);
  assert.match(source, /await import\("\.\/pinterest-render"\)/);
  const route = await readFile("src/app/api/admin/pinterest/connect/route.ts", "utf8");
  assert.doesNotMatch(route, /sharp|pinterest-render/i);
});

test("every Vercel function rendering Pins traces the Linux Sharp binaries", async () => {
  const config = await readFile("next.config.ts", "utf8");
  for (const route of ["/api/admin/pinterest/render", "/api/admin/pinterest/actions", "/api/cron/pinterest"]) {
    const expression = new RegExp('"' + route.replaceAll("/", "\\/") + '"\\s*:\\s*\\[.*sharp-\\*');
    assert.match(config, expression, route + " must bundle libvips dependencies");
  }
});

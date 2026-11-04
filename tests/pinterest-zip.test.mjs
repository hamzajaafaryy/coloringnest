import test from "node:test";
import assert from "node:assert/strict";
import { makePinZip, seoCsvRow } from "../src/lib/pinterest-zip.ts";

test("ZIP package has valid file local, central directory, end signatures", () => {
  const file = makePinZip([
    { name:"image.png", data:new Uint8Array([137,80,78,71]) },
    { name:"pinterest-seo.csv", data:new TextEncoder().encode("title,description") },
  ]);
  const view = new DataView(file.buffer,file.byteOffset,file.byteLength);
  assert.equal(view.getUint32(0,true), 0x04034b50);
  assert.equal(view.getUint32(file.length-22,true), 0x06054b50);
  assert.equal(view.getUint16(file.length-14,true), 2);
  assert.ok(file.length > 150);
});
test("SEO CSV quotes user data and prevents spreadsheet formula injection", () => {
  assert.equal(seoCsvRow(["A \"title\"", "=1+2", "https://craftcoloring.com"]),
    '"A ""title""","\'=1+2","https://craftcoloring.com"');
});

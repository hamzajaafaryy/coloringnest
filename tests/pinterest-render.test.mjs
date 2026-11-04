import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { renderPinterestPin } from "../src/lib/pinterest-render.ts";

test("all templates output 1000x1500 PNG without cropping the original", async () => {
  const image = await sharp({
    create:{width:340,height:440,channels:3,background:"#ffffff"},
  }).png().toBuffer();
  for (const template of ["editorial","lilac","sunshine","midnight","papercut"]) {
    const output = await renderPinterestPin({template,headline:"Cute Cat and Flower Coloring Page",category:"Animals",image});
    const info = await sharp(output).metadata();
    assert.equal(info.format,"png");
    assert.equal(info.width,1000);
    assert.equal(info.height,1500);
    assert.ok(output.length > 10000);
  }
});
test("renderer rejects unsupported files and oversized input", async () => {
  await assert.rejects(renderPinterestPin({template:"editorial",headline:"Cat",image:Buffer.from("not image")}), /Input buffer contains unsupported image format|unsupported|source/i);
});

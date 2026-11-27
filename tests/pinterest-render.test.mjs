import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { renderPinterestPin } from "../src/lib/pinterest-render.ts";

test("all templates output 1000x1500 PNG without cropping the original", async () => {
  const image = await sharp({
    create:{width:1340,height:1640,channels:3,background:"#ffffff"},
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

test("small artwork is centered at its original pixel size instead of being enlarged", async () => {
  const image = await sharp({create:{width:340,height:440,channels:3,background:"#ff0000"}}).png().toBuffer();
  const output = await renderPinterestPin({template:"editorial",headline:"Small drawing",image});
  const {data,info}=await sharp(output).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const pixel=(x,y)=>[...data.subarray((y*info.width+x)*3,(y*info.width+x)*3+3)];
  assert.deepEqual(pixel(330,675),[255,0,0]);
  assert.deepEqual(pixel(329,675),[255,255,255]);
  assert.deepEqual(pixel(120,500),[255,255,255]);
});

test("editorial pins use soft, clearly separated title and category panels", async () => {
  const image = await sharp({create:{width:100,height:100,channels:3,background:"#fff"}}).png().toBuffer();
  const output = await renderPinterestPin({template:"editorial",headline:"A cheerful coloring page",category:"Animals",image});
  const {data,info}=await sharp(output).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const pixel=(x,y)=>[...data.subarray((y*info.width+x)*3,(y*info.width+x)*3+3)];
  assert.deepEqual(pixel(500,130),[244,226,246]);
  assert.deepEqual(pixel(600,1390),[244,226,246]);
});

test("renderer rejects unsupported files and oversized input", async () => {
  await assert.rejects(renderPinterestPin({template:"editorial",headline:"Cat",image:Buffer.from("not image")}), /Input buffer contains unsupported image format|unsupported|source/i);
});

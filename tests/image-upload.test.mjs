import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { prepareImage } from "../src/lib/prepare-image.ts";
import { getColoringImageAssets, coloringImagePaths } from "../src/lib/coloring-image-assets.ts";
import { prepareImageFile, MAX_IMAGE_SOURCE_BYTES } from "../src/lib/image-upload.ts";

const image = (width, height, background = "#ffffff") =>
  sharp({ create: { width, height, channels: 4, background } }).png().toBuffer();

function hasGpsIfd(exif) {
  if (!exif) return false;
  const start = exif.subarray(0, 6).toString() === "Exif\0\0" ? 6 : 0;
  const littleEndian = exif.subarray(start, start + 2).toString() === "II";
  const read16 = offset => littleEndian ? exif.readUInt16LE(offset) : exif.readUInt16BE(offset);
  const read32 = offset => littleEndian ? exif.readUInt32LE(offset) : exif.readUInt32BE(offset);
  const ifd = start + read32(start + 4);
  for (let index = 0; index < read16(ifd); index += 1) {
    if (read16(ifd + 2 + index * 12) === 0x8825) return true;
  }
  return false;
}

test("large portrait artwork produces separate print, preview and card sizes", async () => {
  const { files, warning } = await prepareImage(await image(3400, 4400), "coloring");
  assert.equal(warning, undefined);
  const dimensions = await Promise.all(files.map(async file => {
    const metadata = await sharp(file.data).metadata();
    assert.equal(file.contentType, `image/${metadata.format}`);
    return [metadata.width, metadata.height];
  }));
  assert.deepEqual(dimensions, [[2550, 3300], [1200, 1553], [600, 776]]);
  assert.equal((await sharp(files[0].data).metadata()).density, 300);
});

test("landscape artwork keeps all four corners and its aspect ratio", async () => {
  const input = await sharp(Buffer.from(`<svg width="4000" height="2000" xmlns="http://www.w3.org/2000/svg">
    <rect width="4000" height="2000" fill="white"/>
    <rect width="400" height="400" fill="red"/><rect x="3600" width="400" height="400" fill="green"/>
    <rect y="1600" width="400" height="400" fill="blue"/><rect x="3600" y="1600" width="400" height="400" fill="black"/>
  </svg>`)).png().toBuffer();
  const { files } = await prepareImage(input, "coloring");
  assert.deepEqual(files.map(file => [file.width, file.height]), [[2550, 1275], [1200, 600], [600, 300]]);
  for (const file of files) {
    const { data, info } = await sharp(file.data).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const pixel = (x, y) => [...data.subarray((y * info.width + x) * 3, (y * info.width + x) * 3 + 3)];
    assert.deepEqual(pixel(5, 5), [255, 0, 0]);
    assert.deepEqual(pixel(info.width - 6, 5), [0, 128, 0]);
    assert.deepEqual(pixel(5, info.height - 6), [0, 0, 255]);
    assert.deepEqual(pixel(info.width - 6, info.height - 6), [0, 0, 0]);
  }
});

test("small transparent line art is flattened to white without enlargement or lossy outlines", async () => {
  const input = await sharp(Buffer.from(`<svg width="320" height="480" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20H300V460H20Z M40 60L280 420" fill="none" stroke="black" stroke-width="1"/>
  </svg>`)).png().toBuffer();
  const { files, warning } = await prepareImage(input, "coloring");
  assert.match(warning, /original resolution/);
  const expected = await sharp(input).flatten({ background: "#fff" }).removeAlpha().raw().toBuffer();
  for (const file of files) {
    assert.equal(file.width, 320);
    assert.equal(file.height, 480);
    assert.deepEqual(await sharp(file.data).removeAlpha().raw().toBuffer(), expected);
  }
});

test("EXIF orientation is applied and source location metadata is discarded", async () => {
  const input = await sharp(await image(1400, 1000)).jpeg().withMetadata({ orientation: 6 })
    .withExifMerge({ IFD0: { Artist: "PRIVATE-SOURCE-IDENTITY" }, IFD3: { GPSLatitudeRef: "N", GPSLatitude: "40/1 0/1 0/1" } }).toBuffer();
  assert.equal(hasGpsIfd((await sharp(input).metadata()).exif), true);
  const { files } = await prepareImage(input, "coloring");
  assert.equal(files[0].width, 1000);
  assert.equal(files[0].height, 1400);
  const metadata = await sharp(files[0].data).metadata();
  assert.equal(hasGpsIfd(metadata.exif), false);
  assert.doesNotMatch(metadata.exif?.toString() || "", /PRIVATE-SOURCE-IDENTITY/);
  assert.ok(!metadata.orientation || metadata.orientation === 1);
});

test("category and blog images keep transparency and use the general size profile", async () => {
  const { files } = await prepareImage(await image(3200, 2400, "#00000000"));
  assert.equal(files.length, 1);
  assert.deepEqual([files[0].width, files[0].height], [1600, 1200]);
  assert.equal((await sharp(files[0].data).metadata()).hasAlpha, true);
});

test("malformed files and unsupported image formats cannot produce stored assets", async () => {
  await assert.rejects(prepareImage(Buffer.from("not an image"), "coloring"));
  await assert.rejects(prepareImage(Buffer.from([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10]), "coloring"));
  const gif = await sharp(await image(2, 2)).gif().toBuffer();
  await assert.rejects(prepareImage(gif, "coloring"), /valid PNG/);
});

test("a highly compressed image above the decoder pixel limit is rejected", async () => {
  const oversized = await image(10000, 5000);
  assert.ok(oversized.length < 4 * 1024 * 1024, "compressed byte size alone cannot enforce a pixel limit");
  await assert.rejects(prepareImage(oversized, "coloring"), /pixel limit/);
});

test("versioned asset URLs select real web sizes and delete the entire family", () => {
  const path = "images/optimized-v1/pumpkin-castle-abc123/2550x3300/print.png";
  const base = "https://example.supabase.co/storage/v1/object/public/coloring-pages/";
  const assets = getColoringImageAssets(base + path);
  assert.equal(assets.printUrl, base + path);
  assert.equal(assets.previewUrl, base + path.replace("print.png", "preview.webp"));
  assert.equal(assets.thumbnailUrl, base + path.replace("print.png", "thumbnail.webp"));
  assert.equal(assets.width, 1200);
  assert.equal(assets.height, 1553);
  assert.equal(assets.thumbnailWidth, 600);
  assert.equal(assets.thumbnailHeight, 776);
  assert.match(assets.srcSet, /thumbnail\.webp 600w, .*preview\.webp 1200w$/);
  assert.deepEqual(coloringImagePaths(path), [path, path.replace("print.png", "preview.webp"), path.replace("print.png", "thumbnail.webp")]);
});

test("legacy, external and invalid-dimension image URLs remain unchanged", () => {
  for (const url of [
    "/images/legacy.png",
    "https://example.com/image.jpg",
    "https://example.supabase.co/storage/v1/object/public/coloring-pages/images/old-123.webp",
    "https://example.supabase.co/storage/v1/object/public/coloring-pages/images/optimized-v1/test/0x1/print.png",
  ]) {
    assert.equal(getColoringImageAssets(url).previewUrl, url);
    assert.equal(getColoringImageAssets(url).srcSet, undefined);
  }
  assert.deepEqual(coloringImagePaths("images/old-123.webp"), ["images/old-123.webp"]);
});

test("small-image srcsets report the actual width instead of inventing 1200 source pixels", () => {
  const assets = getColoringImageAssets("https://example.supabase.co/storage/v1/object/public/coloring-pages/images/optimized-v1/small/320x480/print.png");
  assert.equal(assets.width, 320);
  assert.equal(assets.height, 480);
  assert.equal(assets.thumbnailWidth, 320);
  assert.match(assets.srcSet, /preview\.webp 320w$/);
});

test("files that fit the request keep their original bytes; oversized sources are rejected early", async () => {
  const original = new File([await image(20, 30)], "drawing.png", { type: "image/png" });
  assert.equal(await prepareImageFile(original), original);
  await assert.rejects(prepareImageFile(new File([], "empty.png", { type: "image/png" })));
  await assert.rejects(prepareImageFile(new File([new Uint8Array(MAX_IMAGE_SOURCE_BYTES + 1)], "large.png", { type: "image/png" })), /20 MB/);
});

# Automatic coloring image sizes

New coloring-image uploads from Content Studio and the coloring-page create/edit forms use the server's `coloring` profile. Upload PNG, JPEG, or WebP; the browser prepares sources larger than 4 MiB before sending them. The selection limit is 20 MiB, and the server decoder accepts at most 40 million pixels.

**New coloring artwork must have a shorter edge of at least 1200 pixels and at least 1.92 megapixels total** (for example, 1200 × 1600 in portrait orientation or 1600 × 1200 in landscape orientation). The server rejects smaller sources instead of enlarging them and presenting a blurry printable. This check is applied after accounting for EXIF rotation.

The server applies EXIF rotation, fits the complete artwork inside 2550 × 3300 pixels, flattens transparency to white, and creates:

| Asset | Size | Format |
| --- | --- | --- |
| Print/download | Up to 2550 × 3300 | PNG with fresh 300 PPI metadata |
| Article preview | Up to 1200 pixels wide | Lossless WebP |
| Card thumbnail | Up to 600 pixels wide | Lossless WebP |

Aspect ratio is preserved. Images are never cropped, stretched, or enlarged. The print dimensions are bounds, not a forced 17:22 canvas. New low-resolution images are rejected before storage; existing pages and their image URLs remain unchanged.

The database still stores a single `image_url`, pointing to `images/optimized-v1/<slug-and-id>/<width>x<height>/print.png`. The matching web copies live in the same directory. Do not rename one file in an asset family independently. Existing image URLs continue to work unchanged; old content is not automatically rewritten.

Cards request the thumbnail, article images provide responsive preview sources, and print media plus Download Image use the print PNG. Print waits for that image to load. Social metadata uses the preview's actual dimensions instead of claiming every image is 1200 × 630.

Pinterest Studio creates a separate 1000 × 1500 PNG pin from the stored artwork. The artwork is fitted and centered within the pin's paper area without upscaling; small legacy drawings remain small rather than being blurred. New low-resolution uploads are blocked by the coloring upload profile.

Category and blog uploads use the `general` profile: aspect-preserving lossless WebP within 1600 × 1600. SVGs retain their existing vector-validation path and 2 MiB limit.

Supabase Storage must allow the generated objects. The upload route raises an older finite bucket limit to 32 MiB while preserving other settings. Each generated file is checked against that limit. Failed multipart asset uploads are cleaned up, and replacing/deleting a page deletes all three managed images.

Validation: `node --test tests/image-upload.test.mjs tests/pinterest-render.test.mjs`, `npm run typecheck`, and `npm run build` with the repository's required environment configuration.

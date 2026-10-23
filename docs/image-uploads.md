# Automatic coloring image sizes

New coloring-image uploads from Content Studio and the coloring-page create/edit forms use the server's `coloring` profile. Upload PNG, JPEG, or WebP; the browser prepares sources larger than 4 MiB before sending them. The selection limit is 20 MiB, and the server decoder accepts at most 40 million pixels.

The server applies EXIF rotation, fits the complete artwork inside 2550 × 3300 pixels, flattens transparency to white, and creates:

| Asset | Size | Format |
| --- | --- | --- |
| Print/download | Up to 2550 × 3300 | PNG with fresh 300 PPI metadata |
| Article preview | Up to 1200 pixels wide | Lossless WebP |
| Card thumbnail | Up to 600 pixels wide | Lossless WebP |

Aspect ratio is preserved. Images are never cropped, stretched, or enlarged. The print dimensions are bounds, not a forced 17:22 canvas. Small artwork stays at its original resolution, with a message to the editor. These are publishing choices, not a Google-required size or a ranking guarantee.

The database still stores a single `image_url`, pointing to `images/optimized-v1/<slug-and-id>/<width>x<height>/print.png`. The matching web copies live in the same directory. Do not rename one file in an asset family independently. Existing image URLs continue to work unchanged; old content is not automatically rewritten.

Cards request the thumbnail, article images provide responsive preview sources, and print media plus Download Image use the print PNG. Print waits for that image to load. Social metadata uses the preview's actual dimensions instead of claiming every image is 1200 × 630.

Category and blog uploads use the `general` profile: aspect-preserving lossless WebP within 1600 × 1600. SVGs retain their existing vector-validation path and 2 MiB limit.

Supabase Storage must allow the generated objects. The upload route raises an older finite bucket limit to 32 MiB while preserving other settings. Each generated file is checked against that limit. Failed multipart asset uploads are cleaned up, and replacing/deleting a page deletes all three managed images.

Validation: `node --test tests/image-upload.test.mjs`, `npm run typecheck`, and `npm run build` with the repository's required environment configuration.

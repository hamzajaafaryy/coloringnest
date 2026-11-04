# CraftColoring Pinterest Studio

First-party, **admin-only** Pinterest creative production built into Next.js.
No WordPress plugin, paid AI subscription, third-party watermarks, or direct Pinterest password access.

## What it does

- Uses published artwork and every additional collection sheet from the database.
- Creates a crisp 1000×1500 PNG with 2:3 layout from the original drawing (the line art is not redrawn).
- Five original visual templates, editable headline, board suggestion and social SEO.
- Pin title, description, alt text, direct canonical URL plus Pinterest UTM attribution.
- Preview and individual download; bulk ZIP of up to 8 images + CSV + README.
- Admin cookie authorization for every data and render request; source images allowlisted to public Supabase storage.
- This is a **draft/export tool**. No Pinterest scheduling or publishing is claimed until approved API integration is connected.

## Operator workflow

Go to /admin/pinterest-studio, choose a published page or collection sheet,
pick a design template, review/edit title/description/board and alt text, generate a preview, download the PNG or export approved selections.
When manually uploading to Pinterest, paste metadata into your chosen board.
Board suggestions do not imply that a board already exists in your account.

## Editorial guidelines

- Check the rendered drawing matches headline and alt text, especially for old AI-generated posts.
- Choose boards that exist in the actual Pinterest business account.
- Vary designs and publish at a sensible human-reviewed cadence; avoid duplicative/spammy Pins.
- UTM links are for measuring visits in analytics, not proof of ranking.
- Descriptions and copy do not guarantee Pinterest search performance.

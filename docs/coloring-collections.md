# Coloring collections

A coloring post now supports its existing cover plus up to eleven additional drawings. Existing single-image posts keep their content and canonical URL.

## Editing

Open Admin → Coloring Pages → New/Edit. The main image is sheet 1. In **Collection sheets**, add a printable image, a short drawing title and descriptive alt text for each additional drawing. An SVG is optional. Reorder additional drawings using drag-and-drop or the keyboard/touch-friendly Up/Down buttons. Save changes to persist the order. Content Studio also supports the complete collection in the same publishing flow. Add the cover and additional sheets, enter each drawing’s literal title and alt text, then copy the collection-aware master prompt and send all drawings to your writing tool. The JSON describes the overall post; each card holds its own image metadata. Save Draft or Publish Collection persists the post, sheets and FAQs atomically. No second editing step is required. The server validates every artwork URL and collection limit, even for direct API requests.

Visitors see a server-rendered responsive gallery with full-image previews, individual PDF downloads, a complete PDF download, and a separate coloring canvas for each sheet. PDFs support A4 and US Letter with margins, keeping the artwork's proportions. PDF generation runs only after a visitor requests it and refuses to download an incomplete set if an image fails. Raster artwork uses the same fill/brush tools as SVG artwork. Completed coloring strokes are saved locally when browser storage is available; storage clearing or quota limits can prevent recovery.

## Database migration (required before deploying)

Run `node scripts/migrate-collections.mjs` with the target's existing `DATABASE_URL` in the environment. It reads `.env.local` when used locally. Never commit or print credentials.

The idempotent transaction adds `coloring_pages.updated_at`, the `coloring_sheets` table, an index and RLS for the new table. It does not delete, rename or rewrite existing posts, images or categories. Direct server-side PostgreSQL access must use the existing trusted role. No public Supabase REST policies are added. Deleting a post cascades to its additional sheet records. Artwork is retained rather than deleting files that another post might reference.

Deploy only after migration succeeds. Old application versions remain compatible with the additive migration, so rolling back code does not require dropping the new table.

## Search behavior

- Metadata is resolved before streaming, and the root loading boundary is replaced with a reusable loading component so missing posts return an actual HTTP 404 instead of a streamed 200 error page.
- Each post retains one canonical `/coloring-pages/category/slug` URL.
- Old individual `/printable-coloring-pages/category/slug` links redirect permanently to that URL.
- All gallery images, alt text, titles and links are in initial server HTML. Native image lazy loading never hides the gallery behind a click.
- The sitemap lists all collection artwork and excludes unpublished posts and redirected printable detail URLs.
- CollectionPage/ItemList/ImageObject JSON-LD describes the drawings visible on the page; it does not promise a Google rich result.
- `?sheet=` editor selections use a canonical base editor URL and noindex to avoid indexing selection permutations. Invalid selections return 404.
- Submit `/sitemap.xml` in Google Search Console after release and inspect a published collection. Crawling and indexing remain Google's decision.

## Verification

Run `node --test tests/*.test.mjs`, `npm run typecheck`, and `npm run build`. Browser acceptance: add/reorder/save sheets as an admin; verify 390px and desktop layouts; enlarge and close previews; download and inspect the full PDF and an individual PDF; color, navigate away and back; verify drafts return 404 and the old printable URL redirects. Test a legacy single-image page as well.

# Name Coloring

`/name-coloring/` is a static, public page. The name, theme and paper preferences
stay in client state. There is no generation API, paid AI service, account,
database write or name in the URL.

- Four original vector themes: butterflies, garden, space and dinosaurs.
- Capital bubble letter outlines; up to 18 characters, with supported Latin
  accents, spaces, hyphens and apostrophes. Unsupported input is explained before
  export. Two-word names can wrap to two lines; all outlines fit the frame.
- US Letter and A4 canvases, plus an optional dotted name tracing row.
- Standalone SVG and PNG at three times the sheet dimensions (2550×3300 for
  Letter; 2481×3507 for A4). Print uses the selected artwork alone; paper size and
  Save as PDF remain browser print settings.
- The existing coloring editor is loaded only when Color Online is chosen.
  Preview exports are blank sheets; the editor exports the colored canvas.
  Returning to Preview and changing the design starts a fresh coloring session.
  Explicit Save in the editor stores progress in the visitor's local browser.
- Entry points in the header, mobile navigation, footer, homepage and sitemap.

## Letter outlines

The generated `src/lib/name-coloring-glyphs.json` contains a subset of SVG
outlines derived from Fredoka at weight 700 and width 100, named CraftNameOutline.
Copyright 2016 The Fredoka Project Authors. The subset remains under SIL OFL 1.1;
the complete notice/license is in the JSON and `public/licenses/fredoka-OFL.txt`.

Source: https://github.com/google/fonts/tree/main/ofl/fredoka

Pinned Git blob: `349b6ecef8a358ede29b7bf74a08196be5d71b25`.
To regenerate, install FontTools and skia-pathops, obtain that Fredoka variable TTF, and run:

```sh
python scripts/build-name-glyphs.py /path/to/Fredoka-variable.ttf
```

The build script verifies the source blob before producing output. Visitors do
not fetch fonts, artwork or other external resources to create their names.

## Verification

```sh
node --test tests/*.test.mjs
npm run typecheck
npm run build
```

Browser checks should cover typing an accented/hyphenated name, changing all four
themes, A4, tracing, invalid input, both blank downloads, painting a letter and
downloading the colored canvas. Confirm native Print shows only the artwork.

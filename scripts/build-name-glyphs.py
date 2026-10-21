"""Build CraftNameOutline SVG glyphs from the pinned, OFL-licensed Fredoka font.

Run: python scripts/build-name-glyphs.py /path/to/Fredoka-variable.ttf
Requires fonttools and skia-pathops. The generated JSON is used directly; no font or API is loaded
by visitors. Keep public/licenses/fredoka-OFL.txt with the generated data.
"""
import hashlib
import json
import sys
import unicodedata
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.removeOverlaps import removeOverlaps
from fontTools.varLib.instancer import instantiateVariableFont

font_path = Path(sys.argv[1])
raw = font_path.read_bytes()
blob_hash = hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()
expected = "349b6ecef8a358ede29b7bf74a08196be5d71b25"
if blob_hash != expected:
    raise ValueError(f"Unexpected font source: {blob_hash}; expected {expected}")

font = instantiateVariableFont(TTFont(font_path), {"wght": 700, "wdth": 100})
removeOverlaps(font)
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
characters = set("ABCDEFGHIJKLMNOPQRSTUVWXYZ '-’")
for codepoint in range(0xC0, 0x250):
    char = chr(codepoint)
    upper = char.upper()
    if "LATIN" in unicodedata.name(char, "") and len(upper) == 1 and ord(upper) in cmap:
        characters.add(upper)

def number(value):
    return str(round(value, 2)).removesuffix(".0")

glyphs = {}
for char in sorted(characters):
    if ord(char) not in cmap:
        continue
    glyph = glyph_set[cmap[ord(char)]]
    path = SVGPathPen(glyph_set, ntos=number)
    glyph.draw(TransformPen(path, (1, 0, 0, -1, 0, 0)))
    bounds = BoundsPen(glyph_set)
    glyph.draw(bounds)
    x_min, y_min, x_max, y_max = bounds.bounds or (0, 0, 0, 0)
    glyphs[char] = {"path": path.getCommands(), "advance": round(glyph.width, 2),
                    "xMin": x_min, "yMin": y_min, "xMax": x_max, "yMax": y_max}

root = Path(__file__).resolve().parents[1]
data = {"name": "CraftNameOutline", "source": "https://github.com/google/fonts/tree/main/ofl/fredoka",
        "sourceBlob": expected, "copyright": "Copyright 2016 The Fredoka Project Authors (https://github.com/hafontia/Fredoka-One)",
        "license": (root / "public/licenses/fredoka-OFL.txt").read_text(),
        "unitsPerEm": font["head"].unitsPerEm, "glyphs": glyphs}
target = root / "src/lib/name-coloring-glyphs.json"
target.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n")
print(f"Generated {len(glyphs)} outline glyphs ({target.stat().st_size} bytes)")

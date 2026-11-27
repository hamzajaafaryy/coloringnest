import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeSvg } from "../src/lib/sanitize-svg.ts";

test("SVG sanitizer removes executable elements, event handlers and inline styles", () => {
  const input = `<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)">
    <script>alert(1)</script>
    <style>@import url(https://attacker.example/x.css);</style>
    <path d="M0 0L10 10" onclick="alert(1)" style="fill:red"/>
  </svg>`;
  const output = sanitizeSvg(input);
  assert.doesNotMatch(output, /<script|<style|onload|onclick|style=/i);
  assert.match(output, /<path\b/);
});

test("SVG sanitizer rejects encoded, whitespace-prefixed and external href values", () => {
  const input = `<svg xmlns="http://www.w3.org/2000/svg">
    <a href=" javascript:alert(1)"><path d="M0 0L1 1"/></a>
    <use href="&#x23;remote"/>
    <image href="//attacker.example/pixel.svg"/>
  </svg>`;
  const output = sanitizeSvg(input);
  assert.doesNotMatch(output, /href=/i);
});

test("SVG sanitizer keeps local fragment references but removes external url() loads", () => {
  const input = `<svg xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="safe"><stop offset="0" stop-color="#fff"/></linearGradient></defs>
    <path d="M0 0L10 10" fill="url(#safe)"/>
    <path d="M0 0L10 10" filter="url(https://attacker.example/filter.svg#x)"/>
  </svg>`;
  const output = sanitizeSvg(input);
  assert.match(output, /fill="url\(#safe\)"/);
  assert.doesNotMatch(output, /attacker\.example|filter=/i);
});

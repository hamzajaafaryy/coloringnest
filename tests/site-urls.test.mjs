import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalSiteUrl, resolveSiteOrigin, siteRedirectRules } from '../src/lib/site-urls.ts';
import { serializeJsonLd } from '../src/lib/structured-data.ts';

test('site origin stays on the existing host until the owner configures a purchased domain', () => {
  assert.equal(resolveSiteOrigin(), 'https://coloringnest.vercel.app');
  assert.equal(resolveSiteOrigin(' https://craftcoloring.com/// '), 'https://craftcoloring.com');
  assert.equal(resolveSiteOrigin('http://localhost:3011'), 'http://localhost:3011');
  for (const value of ['ftp://example.com', 'https://example.com/path', 'https://example.com?x=1', 'https://example.com/#x', 'https://user:pass@example.com']) assert.throws(() => resolveSiteOrigin(value));
});

test('canonical URLs agree across metadata, Schema and sitemaps without query, hash or trailing slash', () => {
  const origin = 'https://craftcoloring.com';
  assert.equal(canonicalSiteUrl('/', origin), origin);
  assert.equal(canonicalSiteUrl('/blog/example/?preview=true#read', origin), origin + '/blog/example');
  assert.equal(canonicalSiteUrl(origin + '/coloring-pages/animals/', origin), origin + '/coloring-pages/animals');
  assert.throws(() => canonicalSiteUrl('//elsewhere.example/page', origin));
});

test('domain redirects are opt in, host scoped, permanent and cannot loop to the same host', () => {
  const origin = 'https://craftcoloring.com';
  assert.deepEqual(siteRedirectRules(origin), []);
  const rules = siteRedirectRules(origin, 'coloringnest.vercel.app, craftcoloring.com, coloringnest.vercel.app, www.craftcoloring.com');
  assert.equal(rules.length, 2);
  assert.equal(rules[0].has[0].value, 'coloringnest\\.vercel\\.app');
  assert.equal(rules[0].destination, origin + '/:path*');
  assert.equal(rules[0].permanent, true);
  assert.throws(() => siteRedirectRules(origin, 'https://old.example'));
  assert.throws(() => siteRedirectRules(origin, '.*'));
});

test('JSON-LD safely round trips an HTML script closing tag', () => {
  const value = { headline: '</script><script>alert(1)</script>', caption: 'Bird & flower' };
  const json = serializeJsonLd(value);
  assert.ok(!json.includes('<'));
  assert.deepEqual(JSON.parse(json), value);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { parseSheetInputs, primarySheet, sheetEditorUrl } from '../src/lib/coloring-sheets.ts';
const origin = 'https://example.supabase.co';
const sheet = () => ({ id: randomUUID(), title: '  Kitten with yarn  ', altText: 'A kitten beside a ball of yarn.', imageUrl: `${origin}/storage/v1/object/public/coloring-pages/images/kitten.png`, svgUrl: null });
test('legacy single-image posts retain their cover and alt fallback', () => {
  const result = primarySheet({ title: 'Cat', altText: null, imageUrl: '/cat.png' });
  assert.equal(result.id, 'cover'); assert.equal(result.altText, 'Cat'); assert.equal(result.svgUrl, null);
});
test('ordered collection inputs preserve stable IDs and trim titles', () => {
  const a = sheet(), b = sheet();
  const results = parseSheetInputs([b, a], origin);
  assert.deepEqual(results.map(s => s.id), [b.id, a.id]);
  assert.equal(results[0].title, 'Kitten with yarn');
});
test('server rejects excessive sheets, duplicate IDs, blank labels and missing images', () => {
  const a = sheet();
  for (const input of [null, {}, Array.from({length:12}, sheet), [a,a], [{...a, title:''}], [{...a, altText:''}], [{...a, imageUrl:null}]]) assert.throws(() => parseSheetInputs(input, origin));
});
test('artwork URLs cannot target external hosts, signed URLs or another bucket', () => {
  for (const imageUrl of ['https://evil.test/image.png', 'javascript:alert(1)', `${origin}/storage/v1/object/public/other/images/a.png`, `${sheet().imageUrl}?token=secret`, `${origin}.evil.test/storage/v1/object/public/coloring-pages/images/a.png`]) assert.throws(() => parseSheetInputs([{...sheet(), imageUrl}], origin));
});
test('each drawing has a stable editor selection independent of order', () => {
  assert.equal(sheetEditorUrl('cats', 'cover'), '/color-online/cats/');
  const a = sheet(); assert.equal(sheetEditorUrl('cats', a.id), `/color-online/cats/?sheet=${a.id}`);
});

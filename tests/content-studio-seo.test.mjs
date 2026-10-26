import test from 'node:test';
import assert from 'node:assert/strict';
import { validateStudioSeo } from '../src/lib/content-studio-seo.ts';

const valid = () => ({
  title: 'Cute Royal Princess Cat Coloring Page',
  slug: 'cute-royal-princess-cat-coloring-page',
  seoTitle: 'Cute Royal Princess Cat Coloring Page | CraftColoring',
  seoDescription: 'Print this cute royal princess cat coloring page for a fun afternoon at home or school. Grab your crayons and enjoy coloring the crown and dress.',
  description: Array(260).fill('picture').join(' '),
  primaryKeyword: 'princess cat coloring page',
  keywords: ['royal cat coloring sheet', 'princess cat picture', 'cute cat printable', 'cat with crown'],
  altText: 'A cat wearing a crown and a dress.',
  category: 'Princess', tags: ['cat', 'princess', 'crown', 'dress'],
  ageRange: 'Suggested ages 4–8', difficulty: 'Easy',
  faqs: Array.from({ length: 3 }, (_, index) => ({ question: `Question ${index + 1}?`, answer: Array(40).fill('color').join(' ') })),
});

test('new SEO JSON needs no unused cardDescription field', () => {
  const result = validateStudioSeo(valid());
  assert.deepEqual(result.issues, []);
  assert.equal(result.seo.altText, 'A cat wearing a crown and a dress.');
});

test('malformed field types produce errors instead of crashing previews', () => {
  const result = validateStudioSeo({ title: 123, seoTitle: [], category: {}, faqs: [null, 9, { question: {}, answer: true }], tags: [null], keywords: 'cat' });
  assert.ok(result.issues.length > 0);
  assert.equal(result.seo.title, '');
  assert.equal(result.seo.category, '');
  assert.deepEqual(result.seo.faqs[0], { question: '', answer: '' });
});

test('invalid JSON roots cannot be saved as SEO content', () => {
  for (const value of [null, [], 'text', 1, false]) assert.equal(validateStudioSeo(value).seo, null);
});

test('legacy JSON with cardDescription still imports', () => {
  assert.deepEqual(validateStudioSeo({ ...valid(), cardDescription: 'Old unused field' }).issues, []);
});

test('unknown categories and unsupported difficulty cannot pass publication checks', () => {
  const result = validateStudioSeo({ ...valid(), category: 'Invented', difficulty: 'Extreme' });
  assert.ok(result.issues.some(issue => issue.includes('category')));
  assert.ok(result.issues.some(issue => issue.includes('Difficulty')));
});

test('trimmed inputs and array duplicates are validated consistently on client and server', () => {
  const data = valid();
  data.title = `  ${data.title}  `;
  data.tags = [' cat ', 'cat', 'cat', 'cat'];
  const result = validateStudioSeo(data);
  assert.equal(result.seo.title, valid().title);
  assert.deepEqual(result.seo.tags, ['cat']);
  assert.ok(result.issues.some(issue => issue.includes('Tags')));
});

 test('collection titles accept the plural without breaking single pages', () => {
  assert.deepEqual(validateStudioSeo({ ...valid(), title: 'Cute Royal Princess Cat Coloring Pages' }).issues, []);
  assert.ok(validateStudioSeo({ ...valid(), title: 'Cute Royal Princess Cat Collection Book' }).issues.some(issue => issue.includes('Page title')));
});

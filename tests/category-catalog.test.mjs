import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalCategorySlug, categorySlugs, consolidateCategories } from '../src/lib/category-catalog.ts';

const category = (id, slug, values = {}) => ({ id, slug, name: slug, imageUrl: null, description: null, seoTitle: null, seoDescription: null, featured: false, popular: false, pageCount: 0, ...values });

test('import names resolve to original illustrated category URLs', () => {
  assert.equal(canonicalCategorySlug('Princess'), 'princesses');
  assert.equal(canonicalCategorySlug('Ocean & Sea Life'), 'ocean');
  assert.equal(canonicalCategorySlug('Animal'), 'animals');
  assert.equal(canonicalCategorySlug('Flower & Garden'), 'flowers');
  assert.equal(canonicalCategorySlug('New Custom Theme'), 'new-custom-theme');
  assert.deepEqual(categorySlugs('princess'), ['princesses', 'princess']);
});

test('existing images and both sets of pages survive category consolidation', () => {
  const rows = [
    category(1, 'princesses', { imageUrl: '/original.png', description: 'Original description', name: 'Princess Coloring Pages' }),
    category(22, 'princess', { pageCount: 2, featured: true }),
    category(2, 'animals', { featured: true }),
  ];
  const snapshot = JSON.stringify(rows);
  const result = consolidateCategories(rows);
  assert.equal(result.length, 2);
  assert.equal(result[0].slug, 'princesses');
  assert.equal(result[0].id, 1);
  assert.equal(result[0].imageUrl, '/original.png');
  assert.equal(result[0].description, 'Original description');
  assert.equal(result[0].pageCount, 2);
  assert.equal(result[0].featured, true);
  assert.deepEqual(result[0].sourceIds, [1, 22]);
  assert.equal(JSON.stringify(rows), snapshot);
});

test('a lone alias remains readable before the original category exists', () => {
  const result = consolidateCategories([category(22, 'ocean-sea-life', { imageUrl: '/ocean.png', pageCount: 1 })]);
  assert.equal(result[0].slug, 'ocean');
  assert.equal(result[0].id, 22);
  assert.equal(result[0].imageUrl, '/ocean.png');
});

test('counts combine and empty featured categories do not outrank populated ones', () => {
  const result = consolidateCategories([
    category(1, 'ocean', { pageCount: 2 }),
    category(2, 'ocean-sea-life', { pageCount: 1 }),
    category(3, 'animals', { featured: true, popular: true }),
    category(4, null),
  ]);
  assert.deepEqual(result.map(({ slug, pageCount }) => [slug, pageCount]), [['ocean', 3], ['animals', 0]]);
});

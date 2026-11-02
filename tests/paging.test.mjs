import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePage, pageUrl } from '../src/lib/paging.ts';

test('page inputs are validated before reaching SQL offsets', () => {
  for (const value of ['', '0', '-5', 'abc', '1.5', '1 OR 1=1', ['2']]) assert.equal(parsePage(value), 1);
  assert.equal(parsePage('2'), 2);
  assert.equal(parsePage('9999'), 9999);
});
test('links retain queries and page-one canonical paths', () => {
  assert.equal(pageUrl('/coloring-pages', 1), '/coloring-pages');
  assert.equal(pageUrl('/coloring-pages', 2), '/coloring-pages?page=2');
  assert.equal(pageUrl('/search', 2, 'cat & owl'), '/search?q=cat+%26+owl&page=2');
});

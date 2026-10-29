import test from 'node:test';
import assert from 'node:assert/strict';
import { parseArticleContent, parseArticleInline, safeArticleHref } from '../src/lib/article-content.ts';

test('article links become crawlable targets while normal text and emphasis survive', () => {
  assert.deepEqual(parseArticleInline('Try **colors** and [animals](/coloring-pages/animals).'), [
    { type: 'text', text: 'Try ' }, { type: 'strong', text: 'colors' },
    { type: 'text', text: ' and ' }, { type: 'link', text: 'animals', href: '/coloring-pages/animals' },
    { type: 'text', text: '.' },
  ]);
  assert.deepEqual(parseArticleInline('*gentle* `code`'), [
    { type: 'em', text: 'gentle' }, { type: 'text', text: ' ' }, { type: 'code', text: 'code' },
  ]);
});

test('links cannot execute script, data, protocol-relative URLs or backslash host tricks', () => {
  for (const href of ['javascript:alert(1)', 'data:text/html,x', '//evil.example', '/\\evil.example', 'https://user:secret@example.com', 'https://example.com\nx', 'javascript%3Aalert(1)']) {
    assert.equal(safeArticleHref(href), null, href);
  }
  for (const href of ['/coloring-pages/animals?sort=new#picture', '#print', 'https://example.com/page']) assert.equal(safeArticleHref(href), href);
  assert.ok(!parseArticleInline('[bad](javascript:alert)').some(node => node.type === 'link'));
});

test('headings, CRLF, adjacent lists and plain paragraphs retain their structure', () => {
  assert.deepEqual(parseArticleContent('# Body title\r\n\r\nFirst line\r\nsecond line\r\n## Steps\r\n1. Open [page](/coloring-pages)\r\n2. Print\r\n\r\n- Crayons\r\n- Paper'), [
    { type: 'heading', level: 2, text: 'Body title' },
    { type: 'paragraph', text: 'First line second line' },
    { type: 'heading', level: 2, text: 'Steps' },
    { type: 'list', ordered: true, start: 1, items: ['Open [page](/coloring-pages)', 'Print'] },
    { type: 'list', ordered: false, start: 1, items: ['Crayons', 'Paper'] },
  ]);
});

test('HTML and fenced examples remain text, including unclosed fences', () => {
  const html = '<img src=x onerror=alert(1)>';
  assert.deepEqual(parseArticleInline(html), [{ type: 'text', text: html }]);
  assert.deepEqual(parseArticleContent('```html\n' + html + '\n```'), [{ type: 'code', text: html }]);
  assert.deepEqual(parseArticleContent('```\nexample'), [{ type: 'code', text: 'example' }]);
  assert.deepEqual(parseArticleContent('   '), []);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToString } from 'react-dom/server';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');

// Load the actual TypeScript source, without a database or Next.js server.
function loadSource(relative, mocks = {}) {
  const file = path.join(root, relative);
  const source = fs.readFileSync(file, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2020, esModuleInterop: true,
  }}).outputText;
  const loaded = new Module(file);
  loaded.filename = file;
  loaded.paths = Module._nodeModulePaths(path.dirname(file));
  loaded.require = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id.startsWith('@/') || id.startsWith('.')) {
      const local = id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : path.resolve(path.dirname(file), id);
      const candidate = ['.ts', '.tsx'].map(ext => local + ext).find(p => fs.existsSync(p));
      if (candidate) return loadSource(path.relative(root, candidate), mocks);
    }
    return require(id);
  };
  loaded._compile(code, file);
  return loaded.exports;
}

const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150"><rect width="100" height="150" fill="white"/></svg>';

test('editor renders on the server without browser globals', () => {
  assert.equal(typeof globalThis.document, 'undefined');
  const { default: Editor } = loadSource('src/components/ColoringEditor.tsx');
  const html = renderToString(React.createElement(Editor, { slug: 'test', title: 'Test artwork', svgContent: svg }));
  assert.match(html, /<canvas/);
  assert.match(html, /Test artwork/);
});

test('SVG resolver uses inline artwork or a bounded, trusted upload', async () => {
  const { resolveColoringSvg } = loadSource('src/lib/coloring/resolveSvg.ts');
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.SUPABASE_URL;
  process.env.SUPABASE_URL = 'https://test-project.supabase.co';
  let requests = 0;
  globalThis.fetch = async (url, options) => {
    requests++;
    assert.equal(new URL(url).origin, process.env.SUPABASE_URL);
    assert.equal(options.redirect, 'error');
    return new Response(svg);
  };
  const svgUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/coloring-pages/svg/test.svg`;
  try {
    assert.equal(await resolveColoringSvg({ svgContent: svg, svgUrl }), svg);
    assert.equal(requests, 0);
    assert.equal(await resolveColoringSvg({ svgUrl }), svg);
    assert.equal(requests, 1);
    assert.equal(await resolveColoringSvg({ svgUrl: 'https://untrusted.example/test.svg' }), '');
    assert.equal(await resolveColoringSvg({ svgUrl: 'https://test-project.supabase.co/private.svg' }), '');
    assert.equal(requests, 1);
    globalThis.fetch = async () => new Response('x'.repeat(2 * 1024 * 1024 + 1));
    assert.equal(await resolveColoringSvg({ svgUrl }), '');
    globalThis.fetch = async () => new Response('missing', { status: 404 });
    assert.equal(await resolveColoringSvg({ svgUrl }), '');
    globalThis.fetch = async () => { throw new Error('timeout'); };
    assert.equal(await resolveColoringSvg({ svgUrl }), '');
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = previousUrl;
  }
});

test('all coloring mutations invalidate category, detail and printable caches', async () => {
  let paths = [];
  const chain = new Proxy({}, { get: (_, key) => key === 'then'
    ? (resolve) => Promise.resolve([]).then(resolve)
    : () => chain });
  const actions = loadSource('src/lib/admin-crud-actions.ts', {
    '@/db': { db: chain },
    '@/db/schema': { coloringPages: {}, categories: {}, blogPosts: {} },
    'drizzle-orm': { eq: () => ({}) },
    'next/cache': { revalidatePath: (p, type) => paths.push([p, type]) },
    'next/navigation': { redirect: () => {} },
    '@/lib/admin-auth': { isAdminAuthenticated: async () => true },
    '@/lib/storage': { deleteCraftColoringStorageUrl: async () => {} },
  });
  const form = new FormData();
  form.set('title', 'Test'); form.set('name', 'Test');
  for (const action of ['createColoringPage', 'updateColoringPage', 'deleteColoringPage', 'createCategory', 'updateCategory', 'deleteCategory']) {
    paths = [];
    await (action.startsWith('create') ? actions[action](form) : actions[action](1, form));
    for (const route of ['/coloring-pages/[category]', '/coloring-pages/[category]/[slug]', '/printable-coloring-pages/[category]', '/printable-coloring-pages/[category]/[slug]']) {
      assert.ok(paths.some(([p, type]) => p === route && type === 'page'), `${action}: ${route}`);
    }
    assert.ok(paths.some(([p]) => p === '/sitemap.xml'));
  }
});

test('newsletter never claims to subscribe without a mailing backend', () => {
  const { default: Newsletter } = loadSource('src/components/Newsletter.tsx');
  const html = renderToString(React.createElement(Newsletter));
  assert.doesNotMatch(html, /<form|now subscribed/);
  assert.match(html, /Browse Free Coloring Pages/);
});

test('printing isolates artwork, waits for images and cleans up the print frame', async () => {
  const previous = { document: globalThis.document, canvas: globalThis.HTMLCanvasElement, image: globalThis.HTMLImageElement };
  class Canvas { matches() { return true; } toDataURL() { return 'data:image/png;base64,test'; } }
  class Image { matches() { return true; } currentSrc = 'https://storage.example/sheet.png'; }
  globalThis.HTMLCanvasElement = Canvas;
  globalThis.HTMLImageElement = Image;
  const frames = [];
  globalThis.document = {
    getElementById: () => null,
    body: { appendChild: frame => frames.push(frame) },
    createElement: () => {
      const body = [];
      let decoded = false;
      const frame = {
        style: {}, removed: false,
        remove() { this.removed = true; },
        contentDocument: {
          head: { appendChild() {} },
          body: { appendChild: node => body.push(node) },
          createElement: tag => ({ tag, decode: async () => { decoded = true; } }),
        },
        contentWindow: {
          addEventListener: (event, callback) => { assert.equal(event, 'afterprint'); frame.afterPrint = callback; },
          focus() {},
          print() {
            assert.equal(body.length, 1, 'only artwork should be printed');
            if (body[0].tag === 'img') assert.equal(decoded, true, 'image must load before printing');
            frame.printed = body[0];
          },
        },
      };
      return frame;
    },
  };
  try {
    const { printArtwork } = loadSource('src/lib/coloring/printArtwork.ts');
    const svgNode = { matches: () => true, cloneNode: () => ({ tag: 'svg' }) };
    for (const source of [svgNode, new Image(), new Canvas()]) {
      await printArtwork(source, 'Artwork only');
      const frame = frames.at(-1);
      assert.ok(frame.printed);
      assert.equal(frame.contentDocument.title, 'Artwork only');
      frame.afterPrint();
      assert.equal(frame.removed, true);
    }
    await assert.rejects(printArtwork(null, 'Missing'), /No artwork/);
  } finally {
    if (previous.document === undefined) delete globalThis.document; else globalThis.document = previous.document;
    if (previous.canvas === undefined) delete globalThis.HTMLCanvasElement; else globalThis.HTMLCanvasElement = previous.canvas;
    if (previous.image === undefined) delete globalThis.HTMLImageElement; else globalThis.HTMLImageElement = previous.image;
  }
});

test('missing admin settings deny access; valid, invalid and expired sessions are checked', async () => {
  const { createHmac } = await import('node:crypto');
  const names = ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET'];
  const previous = Object.fromEntries(names.map(name => [name, process.env[name]]));
  let token;
  const auth = loadSource('src/lib/admin-auth.ts', {
    'next/headers': { cookies: async () => ({ get: () => token ? { value: token } : undefined }) },
  });
  const configure = () => {
    process.env.ADMIN_USERNAME = 'test-admin';
    process.env.ADMIN_PASSWORD = 'test-only-password';
    process.env.ADMIN_SESSION_SECRET = 'test-only-signing-secret';
  };
  const signed = (expires) => {
    const payload = Buffer.from(JSON.stringify({ username: 'test-admin', exp: expires })).toString('base64url');
    return `${payload}.${createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(payload).digest('hex')}`;
  };
  try {
    configure();
    token = signed(Date.now() + 60_000);
    assert.equal(await auth.isAdminAuthenticated(), true);
    for (const missing of names) {
      configure();
      delete process.env[missing];
      assert.equal(await auth.isAdminAuthenticated(), false, `${missing} must deny access`);
      await assert.rejects(auth.loginAdmin('test-admin', 'test-only-password'), /not configured/);
    }
    configure();
    token = signed(Date.now() - 60_000);
    assert.equal(await auth.isAdminAuthenticated(), false);
    token = `${signed(Date.now() + 60_000)}tampered`;
    assert.equal(await auth.isAdminAuthenticated(), false);
    token = undefined;
    assert.equal(await auth.isAdminAuthenticated(), false);
  } finally {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name]; else process.env[name] = previous[name];
    }
  }
});

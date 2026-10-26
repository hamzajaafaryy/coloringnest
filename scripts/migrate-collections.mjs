import { config } from 'dotenv';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
config({ path: '.env.local' });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  await client.query(await readFile(new URL('../migrations/20261025_coloring_sheets.sql', import.meta.url), 'utf8'));
  console.log('Collection schema ready. Existing coloring pages were preserved.');
} finally { await client.end(); }

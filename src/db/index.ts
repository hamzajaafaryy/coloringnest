import { config } from "dotenv";

config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Make sure .env.local exists in the project root."
  );
}

const globalForDb = globalThis as typeof globalThis & {
  __craftColoringPostgresPool?: Pool;
};

/**
 * Reuse one small pool per warm serverless instance.
 *
 * IMPORTANT: On Vercel, DATABASE_URL must use Supabase's shared
 * Transaction Pooler (port 6543), not Session Pooler (5432) or
 * the direct database endpoint. max: 1 limits each warm instance;
 * transaction pooling is what safely multiplexes many instances.
 *
 * Drizzle's node-postgres driver sends parameterized queries without
 * naming prepared statements, which is compatible with Supavisor
 * transaction mode.
 */
export const pool =
  globalForDb.__craftColoringPostgresPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 1,
    min: 0,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 10_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

// Cache in every environment. In production this reuses the same pool
// if multiple route modules are loaded in the same warm process.
globalForDb.__craftColoringPostgresPool = pool;

export const db = drizzle(pool, {
  schema,
});

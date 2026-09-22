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

export const pool =
  globalForDb.__craftColoringPostgresPool ??
  new Pool({
    connectionString: databaseUrl,

    // Keep only one connection to avoid Supabase connection limits.
    max: 1,
    min: 0,

    // Give Next.js build workers enough time
    // to wait for the available database connection.
    connectionTimeoutMillis: 60_000,

    // Keep the connection alive longer between queries.
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__craftColoringPostgresPool = pool;
}

export const db = drizzle(pool, {
  schema,
});
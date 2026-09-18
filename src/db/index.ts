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
  __coloringNestPostgresPool?: Pool;
};

export const pool =
  globalForDb.__coloringNestPostgresPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 1,
    min: 0,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__coloringNestPostgresPool = pool;
}

export const db = drizzle(pool, {
  schema,
});
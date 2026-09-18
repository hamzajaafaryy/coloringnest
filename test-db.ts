import { config } from "dotenv";
import { Pool } from "pg";

config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testDatabase() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Supabase database connected!");
    console.log("Database time:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

testDatabase();
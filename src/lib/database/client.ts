import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  dbPool: Pool | undefined;
};

// Reuse the pool across HMR reloads in dev — otherwise each edit creates a
// new pool and Neon eventually refuses connections.
function createPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and set it.",
    );
  }
  return new Pool({ connectionString: url, max: 10 });
}

export const pool = globalForDb.dbPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalForDb.dbPool = pool;
}

export const db = drizzle(pool, { schema });

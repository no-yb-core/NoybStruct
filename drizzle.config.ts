import { defineConfig } from "drizzle-kit";

const migrationUrl =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error(
    "Set DATABASE_URL_UNPOOLED (preferred, direct) or DATABASE_URL before running drizzle-kit.",
  );
}

if (!process.env.DATABASE_URL_UNPOOLED) {
  console.warn(
    "[drizzle] DATABASE_URL_UNPOOLED is not set — falling back to DATABASE_URL. " +
      "If that points at pooled.db.prisma.io, migrations may behave unexpectedly.",
  );
}

export default defineConfig({
  schema: "./src/lib/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: migrationUrl },
  casing: "snake_case",
  strict: true,
  verbose: true,
});
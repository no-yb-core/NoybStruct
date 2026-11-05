// src/test/setup-integration.ts
import { config } from "dotenv";
import { existsSync } from "node:fs";

// Load .env.test locally; in CI the workflow sets DATABASE_URL/DIRECT_URL directly.
// dotenv does NOT override existing env vars, so CI values take precedence.
if (existsSync(".env.test")) {
  config({ path: ".env.test" });
}
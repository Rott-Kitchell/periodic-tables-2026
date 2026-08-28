import { defineConfig } from "kysely-ctl";
import { createDbInstance } from "./src/db/database.js";
const environment = process.env.NODE_ENV ?? "development";

const connectionString = {
  development: process.env.DATABASE_URL_DEVELOPMENT,
  test: process.env.DATABASE_URL_TEST,
  production: process.env.DATABASE_URL,
}[environment];

if (!connectionString) {
  throw new Error(`Missing database URL for ${environment}`);
}

export default defineConfig({
  // Dynamically uses your test database if running in a test context, otherwise falls back to dev
  kysely: createDbInstance(connectionString),
  migrations: {
    migrationFolder: "./src/db/migrations",
  },
});

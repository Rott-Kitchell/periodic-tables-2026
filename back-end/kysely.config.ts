import { defineConfig } from "kysely-ctl";
import { createDbInstance } from "./src/db/database.js";

export default defineConfig({
  // Dynamically uses your test database if running in a test context, otherwise falls back to dev
  kysely: createDbInstance(
    process.env.DATABASE_URL_TEST || process.env.DATABASE_URL || "",
  ),
  migrations: {
    migrationFolder: "./src/db/migrations",
  },
});

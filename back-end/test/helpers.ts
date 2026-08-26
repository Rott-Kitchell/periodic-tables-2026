import { Migrator } from "kysely/migration";
import { sql } from "kysely";
import { createDbInstance } from "../src/db/database.js";
import { promises as fs } from "node:fs";

import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupTestDb() {
  const baseConnectionString = process.env.DATABASE_URL_TEST;

  if (!baseConnectionString) {
    throw new Error(
      "DATABASE_URL_TEST env variable is missing! Check your configuration.",
    );
  }

  // Creates an isolated PostgreSQL schema name
  const schemaName =
    `test_schema_${Math.random().toString(36).substring(2, 11)}`.toLowerCase();
  const urlObj = new URL(baseConnectionString);
  urlObj.searchParams.delete("search_path");
  urlObj.searchParams.delete("options");
  const connectionString = urlObj.toString();

  const db = createDbInstance(connectionString);

  // Initialize the schema safely using a temporary connection
  const rootDb = createDbInstance(baseConnectionString);
  await sql`CREATE SCHEMA ${sql.id(schemaName)}`.execute(rootDb);
  await rootDb.destroy();

  await sql`SET search_path TO ${sql.id(schemaName)}, public`.execute(db);

  // Establish a clean disk absolute route reference
  const migrationFolderAbsolute = path.join(__dirname, "../src/db/migrations");

  // Point the migrator directly to your src/db/migrations directory
  const migrator = new Migrator({
    db,
    migrationTableSchema: schemaName,
    provider: {
      async getMigrations() {
        const migrations: Record<string, any> = {};

        // Read raw directory filenames cleanly
        const files = await fs.readdir(migrationFolderAbsolute);

        // Alphanumeric sort guarantees files execute in sequential order
        files.sort();

        for (const file of files) {
          if (file.endsWith(".ts") || file.endsWith(".js")) {
            const migrationName = path.parse(file).name;
            const fullFilePath = path.join(migrationFolderAbsolute, file);

            // Appends file:/// protocol target string rules for Windows ESM loader safety
            const esmImportUrl = pathToFileURL(fullFilePath).href;
            const migrationModule = await import(esmImportUrl);

            migrations[migrationName] = migrationModule;
          }
        }

        return migrations;
      },
    },
  });

  return {
    db,
    migrator,
    schemaName,
    cleanup: async () => {
      const cleanupDb = createDbInstance(baseConnectionString);
      await sql`DROP SCHEMA ${sql.id(schemaName)} CASCADE`.execute(cleanupDb);
      await cleanupDb.destroy();
      await db.destroy();
    },
  };
}

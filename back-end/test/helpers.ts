import { Migrator, FileMigrationProvider } from "kysely/migration";
import { sql } from "kysely";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { createDbInstance } from "../src/db/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupTestDb() {
  const baseConnectionString =
    process.env.DATABASE_URL_TEST ||
    "postgres://postgres:postgres@localhost:5432/periodic_tables_test";

  // Creates an isolated PostgreSQL schema name
  const schemaName = `test_schemem_${Math.random().toString(36).substring(2, 11)}`;
  const connectionString = `${baseConnectionString}?search_path=${schemaName}`;

  const db = createDbInstance(connectionString);

  // Initialize the schema safely using a temporary connection
  const rootDb = createDbInstance(baseConnectionString);
  await sql`CREATE SCHEMA ${sql.id(schemaName)}`.execute(rootDb);

  await rootDb.destroy();

  // Point the migrator directly to your src/db/migrations directory
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "../src/db/migrations"),
    }),
  });

  return {
    db,
    migrator,
    cleanup: async () => {
      const cleanupDb = createDbInstance(baseConnectionString);
      await sql`DROP SCHEMA ${sql.id(schemaName)} CASCADE`.execute(rootDb);
      await cleanupDb.destroy();
      await db.destroy();
    },
  };
}

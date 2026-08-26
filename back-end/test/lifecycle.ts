import { beforeAll, beforeEach, afterAll } from "vitest";
import { Kysely } from "kysely";
import { setupTestDb } from "./helpers.js";
import { runGlobalSeed } from "./seed.js";
import type { Database } from "../src/types.js";

export function useTestLifecycle() {
  let dbInstance: Kysely<Database>;
  let currentSchema: string;
  let dropDatabaseSchema: () => Promise<void> | undefined;

  beforeAll(async () => {
    try {
      const { db, migrator, cleanup, schemaName } = await setupTestDb();
      dbInstance = db;
      currentSchema = schemaName;
      dropDatabaseSchema = cleanup;

      const { error } = await migrator.migrateToLatest();
      if (error) {
        console.error("Test migration sequence failed:", error);
        throw error;
      }
    } catch (err) {
      console.error(
        "Failed to initialize test database layout structure:",
        err,
      );
      throw err;
    }
  });

  beforeEach(async () => {
    await runGlobalSeed(dbInstance);
  });

  afterAll(async () => {
    if (typeof dropDatabaseSchema === "function") {
      await dropDatabaseSchema();
    }
  });

  return {
    get db() {
      return dbInstance;
    },
    get schema() {
      return currentSchema;
    },
  };
}

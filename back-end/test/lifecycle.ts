import { beforeAll, beforeEach, afterAll } from "vitest";
import { Kysely } from "kysely";
import { setupTestDb } from "./helpers";
import { runGlobalSeed } from "./seed";
import { Database } from "../src/types";

export function useTestLifecycle() {
  let dbInstance: Kysely<Database>;
  let dropDatabaseSchema: () => Promise<void>;

  beforeAll(async () => {
    const { db, migrator, cleanup } = await setupTestDb();
    dbInstance = db;
    dropDatabaseSchema = cleanup;

    const { error } = await migrator.migrateToLatest();
    if (error) {
      console.error("Test migration sequence failed:", error);
      throw error;
    }
  });

  beforeEach(async () => {
    await dbInstance.deleteFrom("tables").execute();
    await dbInstance.deleteFrom("reservations").execute();
    await runGlobalSeed(dbInstance);
  });

  afterAll(async () => {
    await dropDatabaseSchema();
  });

  return {
    get db() {
      return dbInstance;
    },
  };
}

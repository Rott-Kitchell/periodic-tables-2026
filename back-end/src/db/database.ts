import type { Database } from "../types.js";
import pkg from "pg";
const { Pool } = pkg;
import { Kysely, PostgresDialect } from "kysely";

export function createDbInstance(connectionString: string) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString,
        min: 1,
        max: 5,
        idleTimeoutMillis: 1000,
        connectionTimeoutMillis: 2000,
      }),
    }),
  });
}

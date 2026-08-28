import { createDbInstance } from "./database.js";

const environment = process.env.NODE_ENV ?? "development";

const connectionString = {
  development: process.env.DATABASE_URL_DEVELOPMENT,
  test: process.env.DATABASE_URL_TEST,
  production: process.env.DATABASE_URL,
}[environment];

if (!connectionString) {
  throw new Error(`Missing database URL for ${environment}`);
}

export const db = createDbInstance(connectionString);

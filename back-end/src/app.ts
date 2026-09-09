import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { zValidator } from "@hono/zod-validator";
import { Kysely, sql, WithSchemaPlugin } from "kysely";
import type { Database } from "./types.js";

import reservationsRouter from "./reservations/reservations.router.js";
import tablesRouter from "./tables/tables.router.js";
import { methodNotAllowed } from "hono/method-not-allowed";

type Env = {
  Variables: {
    db: Kysely<Database>;
  };
};

const app = new Hono<Env>();

app.use("*", logger());
app.use("*", cors());

app.use("*", async (c, next) => {
  const testDb = (c.env as any)?.db as Kysely<Database> | undefined;
  const testSchema = (c.env as any)?.schema as string | undefined;

  if (testDb) {
    if (testSchema) {
      const sanitizedSchema = testSchema.toLowerCase();
      const schemaBoundedDb = testDb.withPlugin(
        new WithSchemaPlugin(sanitizedSchema),
      );
      c.set("db", schemaBoundedDb);
    } else {
      c.set("db", testDb);
    }
  } else if (!c.get("db")) {
    const { createDbInstance } = await import("./db/database.js");
    const globalDb = createDbInstance(process.env.DATABASE_URL || "");
    c.set("db", globalDb);
  }

  await next();
});

app.route("/reservations", reservationsRouter);
app.route("/tables", tablesRouter);

app.use(methodNotAllowed({ app }));

app.notFound((c) => {
  return c.json({ error: `Path not found: ${c.req.path}` }, 404);
});

app.onError((err, c) => {
  const { status = 500, message = "Something went wrong!" } = err as any;
  console.error(message);
  return c.json({ error: message }, status);
});

export default app;

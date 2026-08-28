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
  console.error("🚨 CRITICAL ENDPOINT RUNTIME ERROR:", err);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

// app.post(
//   "/reservations",
//   zValidator("json", z.object({ data: ReservationSchema }), (result, c) => {
//     if (!result.success) {
//       // 1. Target the first broken validation issue row element item
//       const issue = result.error.issues[0];

//       // 2. Extract the field name path (e.g., 'first_name', 'last_name')
//       const fieldName = String(issue.path[issue.path.length - 1] || "field");

//       // 3. Build a targeted error string to pass your specific 'toContain' test conditions
//       const customErrorMessage = `Missing or invalid property: ${fieldName}. Details: ${issue.message}`;

//       return c.json({ error: customErrorMessage }, 400);
//     }
//   }),
//   async (c) => {
//     const db = c.get("db");
//     const body = c.req.valid("json");

//     if (!db) {
//       return c.json(
//         { error: "Database instance context not initialized." },
//         500,
//       );
//     }

//     const newRecord = await db
//       .insertInto("reservations")
//       .values({
//         first_name: body.data.first_name,
//         last_name: body.data.last_name,
//         mobile_number: body.data.mobile_number,
//         reservation_date: body.data.reservation_date,
//         reservation_time: body.data.reservation_time,
//         party_size: body.data.party_size,
//         status: "booked",
//       })
//       .returningAll()
//       .executeTakeFirstOrThrow();

//     return c.json({ data: newRecord }, 201);
//   },
// );

export default app;

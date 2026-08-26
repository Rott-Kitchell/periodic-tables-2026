import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Kysely, sql, WithSchemaPlugin } from "kysely";
import type { Database } from "./types.js";

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

const ReservationSchema = z.object({
  first_name: z.string().min(1, { message: "first_name is required" }),
  last_name: z.string().min(1, { message: "last_name is required" }),
  mobile_number: z.string().min(7, { message: "mobile_number is required" }),
  reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "reservation_date must be a valid date format YYYY-MM-DD",
  }),
  reservation_time: z.string().regex(/^\d{2}:\d{2}$/, {
    message: "reservation_time must be a valid time format HH:MM",
  }),
  party_size: z
    .number()
    .int()
    .positive({ message: "party_size must be a positive integer number" }),
});

app.notFound((c) => {
  return c.json({ error: `Path not found: ${c.req.path}` }, 404);
});

app.onError((err, c) => {
  console.error("🚨 CRITICAL ENDPOINT RUNTIME ERROR:", err);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

app.post(
  "/reservations",
  zValidator("json", z.object({ data: ReservationSchema }), (result, c) => {
    if (!result.success) {
      // 1. Target the first broken validation issue row element item
      const issue = result.error.issues[0];

      // 2. Extract the field name path (e.g., 'first_name', 'last_name')
      const fieldName = String(issue.path[issue.path.length - 1] || "field");

      // 3. Build a targeted error string to pass your specific 'toContain' test conditions
      const customErrorMessage = `Missing or invalid property: ${fieldName}. Details: ${issue.message}`;

      return c.json({ error: customErrorMessage }, 400);
    }
  }),
  async (c) => {
    const db = c.get("db");
    const body = c.req.valid("json");

    if (!db) {
      return c.json(
        { error: "Database instance context not initialized." },
        500,
      );
    }

    const newRecord = await db
      .insertInto("reservations")
      .values({
        first_name: body.data.first_name,
        last_name: body.data.last_name,
        mobile_number: body.data.mobile_number,
        reservation_date: body.data.reservation_date,
        reservation_time: body.data.reservation_time,
        party_size: body.data.party_size,
        status: "booked",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return c.json({ data: newRecord }, 201);
  },
);

export default app;

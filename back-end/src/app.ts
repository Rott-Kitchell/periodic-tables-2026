import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

const ReservationSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  mobile_number: z.string().min(7),
  reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reservation_time: z.string().regex(/^\d{2}:\d{2}$/),
  people: z.int().positive(),
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ message: "Internal Server Error" }, 500);
});

export default app;

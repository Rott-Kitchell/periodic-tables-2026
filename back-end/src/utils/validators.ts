import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

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
    .int()
    .positive({ message: "party_size must be a positive integer number" }),
  status: z.enum(["booked", "seated", "finished", "cancelled"]).optional(),
});

const TableSchema = z.object({
  table_name: z.string().min(1, { message: "table_name is required" }),
  capacity: z
    .int()
    .positive({ message: "capacity must be a positive integer number" }),
  reservation_id: z.int().optional(),
});

export const reservationValidator = zValidator(
  "json",
  z.object({ data: ReservationSchema }),
  (result, c) => {
    if (!result.success) {
      // 1. Target the first broken validation issue row element item
      const issue = result.error.issues[0];

      // 2. Extract the field name path (e.g., 'first_name', 'last_name')
      const fieldName = String(issue.path[issue.path.length - 1] || "field");

      // 3. Build a targeted error string to pass your specific 'toContain' test conditions
      const customErrorMessage = `Missing or invalid property: ${fieldName}. Details: ${issue.message}`;

      return c.json({ error: customErrorMessage }, 400);
    }
    let reservation = result.data.data;

    const reserveDate = new Date(
        `${reservation.reservation_date} ${reservation.reservation_time} GMT-0500`,
      ),
      start = new Date(`${reservation.reservation_date} 10:30:00 GMT-0500`),
      end = new Date(`${reservation.reservation_date} 21:30:00 GMT-0500`);

    const todaysDate = new Date();

    if (reserveDate.getDay() === 2) {
      return c.json(
        {
          error:
            "Reservations cannot be made on a Tuesday (Restaurant is closed).",
        },
        400,
      );
    }
    if (reserveDate < todaysDate) {
      return c.json(
        {
          error: "Reservations must be made in the future.",
        },
        400,
      );
    }
    if (
      reserveDate.getTime() < start.getTime() ||
      reserveDate.getTime() > end.getTime()
    ) {
      return c.json(
        {
          error: "Reservations cannot be made outside of 10:30am to 9:30pm.",
        },
        400,
      );
    }

    if (reservation.status && reservation.status !== "booked") {
      return c.json(
        {
          error: `Status cannot be ${reservation.status}`,
        },
        400,
      );
    }
  },
);

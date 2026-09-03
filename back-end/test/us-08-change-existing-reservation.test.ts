import app from "../src/app.js";
import { useTestLifecycle } from "./lifecycle.js";

describe("US-08 - Change an existing reservation", () => {
  const context = useTestLifecycle();

  describe("PUT /reservations/:reservation_id", () => {
    test("returns 404 if reservation does not exist", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/99999",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).toBeUndefined();
      expect(response.status).toBe(404);
    });

    test("returns 200 if reservation is updated successfully", async () => {
      const expected = {
        first_name: "Harley",
        last_name: "Poe",
        mobile_number: "1234567890",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
        party_size: 4,
      };

      const reservation = await context.db
        .selectFrom("reservations")
        .selectAll()
        .where("reservation_id", "=", 1)
        .executeTakeFirstOrThrow();

      expect(reservation).toBeDefined();

      Object.assign(reservation, expected);

      const response = await app.request(
        `/reservations/${reservation.reservation_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expected),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).toBeUndefined();
      expect(response.status).toBe(200);
      expect(body.data).toEqual(
        expect.objectContaining({
          ...expected,
          reservation_date: expect.stringMatching(expected.reservation_date),
          reservation_time: expect.stringMatching(expected.reservation_time),
        }),
      );
    });
    test("returns 400 if first_name is missing", async () => {
      expect.assertions(2);
      const data = {
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if last_name is missing", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if last_name is empty", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobile_number is missing", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobile_number is empty", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_date is missing", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_time: "19:00",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_date is empty", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "",
        reservation_time: "19:00",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_date is not a date", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "not-a-date",
        reservation_time: "19:00",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_time is missing", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_time is empty", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        reservation_time: "",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_time is not a time", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        reservation_time: "not-a-time",
        party_size: 4,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if party_size is missing", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if party_size is zero", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
        party_size: 0,
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if party_size is not a number", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-01",
        reservation_time: "19:00",
        party_size: "2",
      };
      const response = await app.request(
        "/reservations/1",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
    });
  });

  describe("PUT /reservations/:reservation_id/status", () => {
    test("return 200 for status cancelled", async () => {
      expect.assertions(3);
      const reservation = await context.db
        .selectFrom("reservations")
        .selectAll()
        .orderBy("reservation_date")
        .orderBy("reservation_time")
        .executeTakeFirstOrThrow();

      expect(reservation).toBeDefined();

      const status = "cancelled";

      const response = await app.request(
        `/reservations/${reservation.reservation_id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { status } }),
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.data).toHaveProperty("status", status);
      expect(response.status).toBe(200);
    });
  });
});

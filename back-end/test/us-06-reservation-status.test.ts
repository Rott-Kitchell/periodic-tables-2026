import app from "../src/app.js";
import { useTestLifecycle } from "./lifecycle.js";
import type { Reservation, Table } from "../src/types.js";

describe("US-06 - Reservation status", () => {
  const context = useTestLifecycle();

  describe("POST /reservations", () => {
    test("return 201 if status is 'booked'", async () => {
      expect.assertions(3);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-02",
        reservation_time: "19:00",
        party_size: 4,
        status: "booked",
      };
      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(body.error).toBeUndefined();
      expect(response.status).toBe(201);
      expect(body.data).toEqual(
        expect.objectContaining({
          first_name: "first",
          last_name: "last",
          mobile_number: "123-456-7890",
          reservation_date: expect.stringContaining("2030-01-02"),
          reservation_time: expect.stringContaining("19:00"),
          party_size: 4,
        }),
      );
    });
    test.for(["seated", "finished"])(
      "returns 400 if status is '%s'",
      async (status) => {
        expect.assertions(2);
        const data = {
          first_name: "first",
          last_name: "last",
          mobile_number: "123-456-7890",
          reservation_date: "2030-01-02",
          reservation_time: "19:00",
          party_size: 4,
          status: status,
        };
        const response = await app.request(
          "/reservations",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.error).toContain(status);
      },
    );
  });

  describe("PUT /reservations/:reservation_id/status", () => {
    let reservationOne: Reservation;
    let reservationTwo: Reservation;
    beforeEach(async () => {
      const reservations = await context.db
        .selectFrom("reservations")
        .selectAll()
        .orderBy("reservation_date")
        .orderBy("reservation_time")
        .execute();
      reservationOne = reservations[0];
      reservationTwo = reservations[1];
    });

    test("returns 404 for non-existent reservation_id", async () => {
      expect.assertions(2);
      const response = await app.request(
        `/reservations/99/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { status: "seated" } }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(404);
      expect(body.error).toContain("99");
    });

    test("returns 400 for unknown status", async () => {
      expect.assertions(2);
      const response = await app.request(
        `/reservations/${reservationOne.reservation_id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { status: "unknown" } }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("unknown");
    });
    test("returns 400 if reservation is already finished", async () => {
      expect(reservationOne).toBeDefined();

      reservationOne.status = "finished";
      await context.db
        .updateTable("reservations")
        .set(reservationOne)
        .where("reservation_id", "=", reservationOne.reservation_id)
        .executeTakeFirstOrThrow();

      const response = await app.request(
        `/reservations/${reservationOne.reservation_id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { status: "seated" } }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("finished");
    });

    test.for(["booked", "seated", "finished"])(
      "returns 200 if status is updated to '%s'",
      async (status) => {
        expect(reservationOne).toBeDefined();
        const response = await app.request(
          `/reservations/${reservationOne.reservation_id}/status`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { status } }),
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(200);
        expect(body.data).toHaveProperty("status", status);
      },
    );
  });

  describe("PUT /tables/:table_id/seat", () => {
    let reservationOne: Reservation;
    let tableOne: Table;
    let tableTwo: Table;
    beforeEach(async () => {
      reservationOne = await context.db
        .selectFrom("reservations")
        .selectAll()
        .orderBy("reservation_date")
        .orderBy("reservation_time")
        .executeTakeFirstOrThrow();
      const tables = await context.db
        .selectFrom("tables")
        .selectAll()
        .orderBy("table_name")
        .execute();
      tableOne = tables[0];
      tableTwo = tables[1];
    });

    test("return 200 and changes reservation status to 'seated'", async () => {
      expect(tableOne).toBeDefined();
      expect(reservationOne).toBeDefined();
      const seatResponse = await app.request(
        `/reservations/${reservationOne.reservation_id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { status: "seated" } }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await seatResponse.json();
      expect(seatResponse.status).toBe(200);
      expect(body.error).toBeUndefined();

      const reservationResponse = await app.request(
        `/reservations/${reservationOne.reservation_id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const reservationBody = await reservationResponse.json();
      expect(reservationBody.error).toBeUndefined();
      expect(reservationResponse.status).toBe(200);
      expect(reservationBody.data).toHaveProperty("status", "seated");
    });

    test("return 400 if reservation is already seated", async () => {
      expect(tableOne).toBeDefined();
      expect(reservationOne).toBeDefined();
      const firstSeatResponse = await app.request(
        `/tables/${tableOne.table_id}/seat`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { reservation_id: reservationOne.reservation_id },
          }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const firstSeatBody = await firstSeatResponse.json();
      expect(firstSeatResponse.status).toBe(200);
      expect(firstSeatBody.error).toBeUndefined();

      const secondSeatResponse = await app.request(
        `/tables/${tableOne.table_id}/seat`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { reservation_id: reservationOne.reservation_id },
          }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const secondSeatBody = await secondSeatResponse.json();
      expect(secondSeatResponse.status).toBe(400);
      expect(secondSeatBody.error).toMatch(/seated|occupied/);
    });
  });

  describe("DELETE /tables/:table_id/seat", () => {
    let tableOne: Table;
    let reservationOne: Reservation;
    beforeEach(async () => {
      tableOne = await context.db
        .selectFrom("tables")
        .selectAll()
        .orderBy("table_name")
        .executeTakeFirstOrThrow();
      reservationOne = await context.db
        .selectFrom("reservations")
        .selectAll()
        .orderBy("reservation_date")
        .orderBy("reservation_time")
        .executeTakeFirstOrThrow();
    });

    test("returns 200 and changes reservation status to 'finished'", async () => {
      expect(tableOne).toBeDefined();
      expect(reservationOne).toBeDefined();

      const seatResponse = await app.request(
        `/tables/${tableOne.table_id}/seat`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { reservation_id: reservationOne.reservation_id },
          }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const seatBody = await seatResponse.json();
      expect(seatResponse.status).toBe(200);
      expect(seatBody.error).toBeUndefined();

      const finishResponse = await app.request(
        `/tables/${tableOne.table_id}/seat`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { reservation_id: reservationOne.reservation_id },
          }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const finishBody = await finishResponse.json();
      expect(finishResponse.status).toBe(200);
      expect(finishBody.error).toBeUndefined();

      const reservationResponse = await app.request(
        `/reservations/${reservationOne.reservation_id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const reservationBody = await reservationResponse.json();
      expect(reservationResponse.status).toBe(200);
      expect(reservationBody.data.status).toBe("finished");
    });
  });

  describe("GET /reservations/date=XXXX-XX-XX", () => {
    let reservationOne: Reservation;
    let tableOne: Table;
    beforeEach(async () => {
      reservationOne = await context.db
        .selectFrom("reservations")
        .selectAll()
        .orderBy("reservation_date")
        .orderBy("reservation_time")
        .executeTakeFirstOrThrow();
      tableOne = await context.db
        .selectFrom("tables")
        .selectAll()
        .orderBy("table_name")
        .executeTakeFirstOrThrow();
    });

    test("does not include finished reservations in the list", async () => {
      expect(reservationOne).toBeDefined();
      expect(tableOne).toBeDefined();

      const seatResponse = await app.request(
        `/tables/${tableOne.table_id}/seat`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { reservation_id: reservationOne.reservation_id },
          }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const seatBody = await seatResponse.json();
      expect(seatResponse.status).toBe(200);
      expect(seatBody.error).toBeUndefined();

      const finishResponse = await app.request(
        `/tables/${tableOne.table_id}/seat`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { reservation_id: reservationOne.reservation_id },
          }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const finishBody = await finishResponse.json();
      expect(finishResponse.status).toBe(200);
      expect(finishBody.error).toBeUndefined();

      const reservationsResponse = await app.request(
        `/reservations?date=${asDateString(reservationOne.reservation_date)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const reservationsBody = await reservationsResponse.json();
      expect(reservationsResponse.status).toBe(200);
      expect(reservationsBody.error).toBeUndefined();
      const finishedReservation = reservationsBody.data.filter(
        (reservation: Reservation) => reservation.status === "finished",
      );
      expect(finishedReservation).toHaveLength(0);
    });
  });
});

function asDateString(date: Date | string): string {
  if (typeof date === "string") return date;

  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

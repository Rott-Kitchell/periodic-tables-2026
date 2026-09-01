import app from "../src/app.js";
import { useTestLifecycle } from "./lifecycle.js";

describe("US-01 - Create and list reservations", () => {
  const context = useTestLifecycle();

  describe("App", () => {
    describe("not found handler", () => {
      test("returns 404 for non-existent route", async () => {
        expect.assertions(2);

        const response = await app.request(
          "/fastidious",
          {
            headers: { Accept: "application/json" },
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(404);
        expect(body.error).toBe("Path not found: /fastidious");
      });
    });
  });

  describe("GET /reservations", () => {
    test("returns only reservations matching date query parameter", async () => {
      expect.assertions(3);
      const response = await app.request(
        "/reservations?date=2026-12-16",
        {
          headers: { Accept: "application/json" },
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );

      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].first_name).toBe("Norma");
    });

    test("returns reservations sorted by time (earliest time first)", async () => {
      expect.assertions(4);
      const response = await app.request(
        "/reservations?date=2026-12-15",
        {
          headers: { Accept: "application/json" },
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.data).toHaveLength(4);
      expect(body.data[0].first_name).toBe("Thomas");
      expect(body.data[1].first_name).toBe("Jordan");
    });
  });

  describe("GET /reservations/:reservation_id", () => {
    test("returns 404 for non-existant id", async () => {
      expect.assertions(2);
      const response = await app.request(
        "/reservations/99",
        {
          headers: { Accept: "application/json" },
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
  });

  describe("POST /reservations", () => {
    test("returns 400 if data is missing", async () => {
      expect.assertions(2);
      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ datum: {} }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toBeDefined();
    });

    test("returns 400 if first_name is missing", async () => {
      expect.assertions(2);
      const invalidData = {
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2026-01-01",
        reservation_time: "13:30",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );

      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("first_name");
    });

    test("returns 400 if first_name is empty", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2026-01-01",
        reservation_time: "13:30",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("first_name");
    });

    test("returns 400 if last_name is missing", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        mobile_number: "800-555-1212",
        reservation_date: "2026-01-01",
        reservation_time: "13:30",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("last_name");
    });

    test("returns 400 if last_name is empty", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "",
        mobile_number: "800-555-1212",
        reservation_date: "2026-01-01",
        reservation_time: "13:30",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("last_name");
    });

    test("returns 400 if mobile_number is missing", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        reservation_date: "2026-01-01",
        reservation_time: "13:30",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("mobile_number");
    });

    test("returns 400 if mobile_number is empty", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "",
        reservation_date: "2026-01-01",
        reservation_time: "13:30",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("mobile_number");
    });

    test("returns 400 if reservation_date is missing", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_time: "13:30",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("reservation_date");
    });

    test("returns 400 if reservation_date is empty", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "",
        reservation_time: "13:30",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("reservation_date");
    });

    test("returns 400 if reservation_date is not a date", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "not-a-date",
        reservation_time: "13:30",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("reservation_date");
    });

    test("returns 400 if reservation_time is missing", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2026-01-01",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("reservation_time");
    });

    test("returns 400 if reservation_time is empty", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2026-01-01",
        reservation_time: "",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("reservation_time");
    });

    test("returns 400 if reservation_time is not a time", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2026-12-01",
        reservation_time: "not-a-time",
        party_size: 1,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("reservation_time");
    });

    test("returns 400 if party_size is missing", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2026-01-01",
        reservation_time: "13:30",
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("party_size");
    });

    test("returns 400 if party_size is zero", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2026-01-01",
        reservation_time: "13:30",
        party_size: 0,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("party_size");
    });

    test("returns 400 if reservation_time is not a number", async () => {
      expect.assertions(2);
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2026-12-01",
        reservation_time: "13:30",
        party_size: "2",
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: invalidData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("party_size");
    });

    test("returns 201 if data is valid", async () => {
      expect.assertions(3);
      const validData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2026-12-01",
        reservation_time: "13:30",
        party_size: 2,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: validData }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );

      if (response.status === 500) {
        const rawTextBody = await response.text();
        console.error("⛔ EXPLICIT TEST FAILURE DISCOVERY LOG:", rawTextBody);
      }

      const body = await response.json();
      expect(response.status).toBe(201);
      expect(body.error).toBeUndefined();
      expect(body.data).toEqual(
        expect.objectContaining({
          first_name: "first",
          last_name: "last",
          mobile_number: "800-555-1212",
          reservation_date: expect.stringContaining("2026-12-01"),
          reservation_time: expect.stringContaining("13:30"),
          party_size: 2,
        }),
      );
    });
  });
});

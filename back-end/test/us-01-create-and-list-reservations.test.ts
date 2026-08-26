import { describe, test, expect } from "vitest";
import app from "../src/app";
import { useTestLifecycle } from "./lifecycle";

describe("US-01 - Create and list reservations", () => {
  const context = useTestLifecycle();

  describe("App", () => {
    describe("not found handler", () => {
      test("returns 404 for non-existent route", async () => {
        const response = await app.request(
          "/fastidious",
          {
            headers: { Accept: "application/json" },
          },
          {
            variables: { db: context.db },
          },
        );
        expect(response.status).toBe(404);
        const body = await response.json();
        expect(body.error).toBe("Path not found: /fastidious");
      });
    });
  });

  describe("GET /reservations/:reservation_id", () => {
    test("returns 404 for non-existant id", async () => {
      const response = await app.request(
        "/reservations/99",
        {
          headers: { Accept: "application/json" },
        },
        {
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error).toContain("99");
    });
  });

  describe("POST /reservations", () => {
    test("returns 400 if data is missing", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBeDefined();
    });

    test("returns 400 if first_name is missing", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("first_name");
    });

    test("returns 400 if last_name is missing", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("last_name");
    });

    test("returns 400 if last_name is empty", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("last_name");
    });

    test("returns 400 if mobile_phone is missing", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("mobile_phone");
    });

    test("returns 400 if mobile_phone is empty", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("mobile_phone");
    });

    test("returns 400 if reservation_date is missing", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("reservation_date");
    });

    test("returns 400 if reservation_date is empty", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("reservation_date");
    });

    test("returns 400 if reservation_date is not a date", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("reservation_date");
    });

    test("returns 400 if reservation_time is missing", async () => {
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_numbe: "800-555-1212",
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("reservation_time");
    });

    test("returns 400 if reservation_time is empty", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("reservation_time");
    });

    test("returns 400 if reservation_time is not a time", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("reservation_time");
    });

    test("returns 400 if party_size is missing", async () => {
      const invalidData = {
        first_name: "first",
        last_name: "last",
        mobile_numbe: "800-555-1212",
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("party_size");
    });

    test("returns 400 if party_size is zero", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("party_size");
    });

    test("returns 400 if reservation_time is not a number", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toContain("party_size");
    });

    test("returns 4201 if data is valid", async () => {
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
          variables: { db: context.db },
        },
      );
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.error).toBeDefined();
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

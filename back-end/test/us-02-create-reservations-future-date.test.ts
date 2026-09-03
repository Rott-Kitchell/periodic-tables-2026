import app from "../src/app.js";
import { useTestLifecycle } from "./lifecycle.js";

describe("US-02: Create reservations future date", () => {
  const context = useTestLifecycle();

  describe("POST /reservations", () => {
    test("returns 400 if reservation occurs in the past", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2000-01-01",
        reservation_time: "19:00",
        party_size: 4,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: data }),
        },
        { db: context.db, schema: context.schema },
      );

      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("future");
    });
    test("returns 400 if rservation_date falls on a Tuesday", async () => {
      expect.assertions(2);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "123-456-7890",
        reservation_date: "2030-01-15", // This date is a Tuesday
        reservation_time: "19:00",
        party_size: 4,
      };

      const response = await app.request(
        "/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: data }),
        },
        { db: context.db, schema: context.schema },
      );

      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("closed");
    });
  });
});

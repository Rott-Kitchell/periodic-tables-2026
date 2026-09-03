import app from "../src/app.js";
import { useTestLifecycle } from "./lifecycle.js";

describe("US-03 - Create reservation eligable timeframe", () => {
  const context = useTestLifecycle();

  describe("POST /reservations", () => {
    test("returns 400 if reservation_time is not available", async () => {
      expect.assertions(4);
      const data = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2050-01-05",
        reservation_time: "09:30",
        party_size: 3,
      };

      let response = await app.request(
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
      expect(response.status).toBe(400);

      data.reservation_time = "23:30";
      response = await app.request(
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
      expect(response.status).toBe(400);

      data.reservation_time = "22:45";
      response = await app.request(
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
      expect(response.status).toBe(400);

      data.reservation_time = "05:30";
      response = await app.request(
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
      expect(response.status).toBe(400);
    });
  });
});

import app from "../src/app.js";
import { useTestLifecycle } from "./lifecycle.js";

describe("US-07 - Search reservations by phone number", () => {
  const context = useTestLifecycle();

  describe("GET /reservations?mobile_number=...", () => {
    test("returns reservations for a partial existing mobile number", async () => {
      expect.assertions(2);
      const response = await app.request(
        "/reservations?mobile_number=555",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).toBeUndefined();
      expect(body.data).toHaveLength(4);
    });
    test("returns empty list for a non-existing mobile number", async () => {
      expect.assertions(2);
      const response = await app.request(
        "/reservations?mobile_number=999-999-9999",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
        { db: context.db, schema: context.schema },
      );
      const body = await response.json();
      expect(body.error).toBeUndefined();
      expect(body.data).toHaveLength(0);
    });
  });
});

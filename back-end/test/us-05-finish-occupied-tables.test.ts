import app from "../src/app.js";
import { useTestLifecycle } from "./lifecycle.js";
import type { Table } from "../src/types.js";

describe("US-05 - Finish an occupied table", () => {
  const context = useTestLifecycle();

  describe("DELETE /tables/:table_id/seat", () => {
    let barTableOne: Table;
    let tableOne: Table;

    beforeEach(async () => {
      barTableOne = await context.db
        .selectFrom("tables")
        .where("table_name", "=", "Bar #1")
        .selectAll()
        .executeTakeFirstOrThrow();
      tableOne = await context.db
        .selectFrom("tables")
        .where("table_name", "=", "#1")
        .selectAll()
        .executeTakeFirstOrThrow();
    });

    test("returns 404 if table_id does not exist", async () => {
      expect.assertions(2);
      const response = await app.request(
        `/tables/99999/seat`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ datum: {} }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(404);
      expect(body.error).toContain("99999");
    });

    test("returns 400 if table is not occupied", async () => {
      expect.assertions(2);
      const response = await app.request(
        `/tables/${tableOne.table_id}/seat`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toContain("not occupied");
    });

    test("returns 200 if table is finished successfully", async () => {
      expect(tableOne).toBeDefined();
      const seatResponse = await app.request(
        `/tables/${tableOne.table_id}/seat`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { reservation_id: 1 } }),
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const seatBody = await seatResponse.json();
      expect(seatResponse.status).toBe(200);
      expect(seatBody.error).toBeUndefined();

      const response = await app.request(
        `/tables/${tableOne.table_id}/seat`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
        {
          db: context.db,
          schema: context.schema,
        },
      );
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.error).toBeUndefined();
    });
  });
});

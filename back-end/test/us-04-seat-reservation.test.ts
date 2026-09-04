import app from "../src/app.js";
import { useTestLifecycle } from "./lifecycle.js";
import type { Table } from "../src/types.js";

describe("US-04 - Seat reservation", () => {
  const context = useTestLifecycle();

  describe("Create and list tables", () => {
    // Test cases for creating and listing tables
    describe("GET /tables/:table_id", () => {
      test("returns 404 for nonexistent id", async () => {
        expect.assertions(2);
        const response = await app.request(
          "/tables/99999",
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
        expect(body.error).toContain("99999");
      });
    });
    describe("POST /tables", () => {
      test("returns 400 if data is missing", async () => {
        expect.assertions(2);
        const response = await app.request(
          "/tables",
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
      test("returns 400 if table_name is missing", async () => {
        expect.assertions(2);
        const data = {
          capacity: 1,
        };
        const response = await app.request(
          "/tables",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ data }),
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.error).toContain("table_name");
      });
      test("returns 400 if table_name is empty", async () => {
        expect.assertions(2);
        const data = {
          table_name: "",
          capacity: 1,
        };
        const response = await app.request(
          "/tables",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ data }),
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.error).toContain("table_name");
      });
      test("returns 400 if table_name is less than 2 characters", async () => {
        expect.assertions(2);
        const data = {
          table_name: "A",
          capacity: 1,
        };
        const response = await app.request(
          "/tables",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ data }),
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.error).toContain("table_name");
      });
      test("returns 400 if capacity is missing", async () => {
        expect.assertions(2);
        const data = {
          table_name: "Table 1",
        };
        const response = await app.request(
          "/tables",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ data }),
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.error).toContain("capacity");
      });
      test("returns 400 if capacity is zero", async () => {
        expect.assertions(2);
        const data = {
          table_name: "Table 1",
          capacity: 0,
        };
        const response = await app.request(
          "/tables",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ data }),
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.error).toContain("capacity");
      });
      test("returns 400 if capacity is not a number", async () => {
        expect.assertions(2);
        const data = {
          table_name: "Table 1",
          capacity: "2",
        };
        const response = await app.request(
          "/tables",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ data }),
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.error).toContain("capacity");
      });
      test("returns 201 if table is created successfully", async () => {
        expect.assertions(3);
        const data = {
          table_name: "Table 1",
          capacity: 4,
        };
        const response = await app.request(
          "/tables",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ data }),
          },
          {
            db: context.db,
            schema: context.schema,
          },
        );
        const body = await response.json();
        expect(response.status).toBe(201);
        expect(body.data).toEqual(expect.objectContaining(data));
        expect(body.error).toBeUndefined();
      });
    });

    describe("GET /tables", () => {
      test("returns all tables sorted by table name", async () => {
        expect.assertions(7);
        const response = await app.request(
          "/tables",
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
        expect(body.error).toBeUndefined();
        expect(body.data).toHaveLength(4);
        expect(body.data[0].table_name).toBe("#1");
        expect(body.data[1].table_name).toBe("#2");
        expect(body.data[2].table_name).toBe("Bar #1");
        expect(body.data[3].table_name).toBe("Bar #2");
      });
    });
  });

  describe("Read reservation", () => {
    describe("GET /reservations/:reservation_id", () => {
      test("returns 200 for an existing id", async () => {
        expect.assertions(3);
        const response = await app.request(
          "/reservations/1",
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
        expect(body.error).toBeUndefined();
        expect(body.data.reservation_id).toBe(1);
      });
    });
  });

  describe("Seat reservation", () => {
    let barTableOne: Table;
    let tableOne: Table;

    beforeEach(async () => {
      barTableOne = await context.db
        .selectFrom("tables")
        .selectAll()
        .where("table_name", "=", "Bar #1")
        .executeTakeFirstOrThrow();
      tableOne = await context.db
        .selectFrom("tables")
        .selectAll()
        .where("table_name", "=", "#1")
        .executeTakeFirstOrThrow();
    });

    describe("PUT /tables/:table_id/seat", () => {
      test("returns 400 if data is missing", async () => {
        expect(tableOne).toBeDefined();
        const data = {};
        const response = await app.request(
          `/tables/${tableOne.table_id}/seat`,
          {
            method: "PUT",
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
        expect(body.error).toContain("reservation_id");
      });

      test("returns 404 if reservation_id does not exist", async () => {
        expect(tableOne).toBeDefined();
        const data = { reservation_id: 99999 };
        const response = await app.request(
          `/tables/${tableOne.table_id}/seat`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
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

      test("returns 200 if table has sufficienty capacity", async () => {
        expect(tableOne).toBeDefined();
        const data = { reservation_id: 1 };
        const response = await app.request(
          `/tables/${tableOne.table_id}/seat`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
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
      test("returns 400 if table does not have sufficient capacity", async () => {
        expect(barTableOne).toBeDefined();
        const data = { reservation_id: 1 };

        const response = await app.request(
          `/tables/${barTableOne.table_id}/seat`,
          {
            method: "PUT",
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
        expect(body.error).toContain("capacity");
      });
      test("returns 400 if table is already occupied", async () => {
        expect(tableOne).toBeDefined();
        // First, seat a reservation at tableOne
        const occupyResponse = await app.request(
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
        const occupyBody = await occupyResponse.json();
        expect(occupyResponse.status).toBe(200);
        expect(occupyBody.error).toBeUndefined();

        // Then, try to seat another reservation at the same table
        const data = { reservation_id: 2 };
        const response = await app.request(
          `/tables/${tableOne.table_id}/seat`,
          {
            method: "PUT",
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
        expect(body.error).toContain("occupied");
      });
    });
  });
});

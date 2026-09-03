import { Kysely, sql } from "kysely";
import type { Database } from "../src/types.js";

export async function runGlobalSeed(db: Kysely<Database>): Promise<void> {
  await sql`TRUNCATE TABLE reservations, tables RESTART IDENTITY CASCADE`.execute(
    db,
  );

  await db
    .insertInto("reservations")
    .values([
      {
        first_name: "Jordan",
        last_name: "Buckley",
        mobile_number: "555-123-0100",
        party_size: 5,
        reservation_date: "2030-12-15",
        reservation_time: "19:00:00",
      },
      {
        first_name: "Norma",
        last_name: "Jean",
        mobile_number: "555-123-0199",
        party_size: 6,
        reservation_date: "2030-12-16",
        reservation_time: "20:00",
      },
      {
        first_name: "Garrett",
        last_name: "Russell",
        mobile_number: "555-123-0125",
        party_size: 4,
        reservation_date: "2030-12-15",
        reservation_time: "20:00",
      },
      {
        first_name: "Thomas",
        last_name: "Erak",
        mobile_number: "555-123-0130",
        party_size: 6,
        reservation_date: "2030-12-15",
        reservation_time: "18:00",
      },
      {
        first_name: "Alex",
        last_name: "Eilers",
        mobile_number: "555-123-0101",
        party_size: 1,
        reservation_date: "2030-12-15",
        reservation_time: "20:00",
      },
    ])
    .execute();

  await db
    .insertInto("tables")
    .values([
      { table_name: "Bar #1", capacity: 1 },
      { table_name: "Bar #2", capacity: 1 },
      { table_name: "Table #1", capacity: 6 },
      { table_name: "Table #2", capacity: 6 },
    ])
    .execute();
}

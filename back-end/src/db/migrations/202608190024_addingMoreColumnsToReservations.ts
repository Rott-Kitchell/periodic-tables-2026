import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  const checkColumn = await db
    .selectFrom("information_schema.columns")
    .select("column_name")
    .where("table_schema", "=", sql`current_schema()`)
    .where("table_name", "=", "reservations")
    .where("column_name", "=", "first_name")
    .executeTakeFirst();

  if (!checkColumn) {
    await db.schema
      .alterTable("reservations")
      .addColumn("first_name", "varchar", (col) => col.notNull())
      .addColumn("last_name", "varchar", (col) => col.notNull())
      .addColumn("mobile_number", "varchar", (col) => col.notNull())
      .addColumn("reservation_date", "date", (col) => col.notNull())
      .addColumn("reservation_time", "time", (col) => col.notNull())
      .addColumn("party_size", "integer", (col) => col.notNull())
      .addColumn("status", "varchar", (col) =>
        col.notNull().defaultTo("booked"),
      )
      .execute();
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  const checkColumn = await db
    .selectFrom("information_schema.columns")
    .select("column_name")
    .where("table_schema", "=", sql`current_schema()`)
    .where("table_name", "=", "reservations")
    .where("column_name", "=", "first_name")
    .executeTakeFirst();

  if (checkColumn) {
    await db.schema
      .alterTable("reservations")
      .dropColumn("first_name")
      .dropColumn("last_name")
      .dropColumn("mobile_number")
      .dropColumn("reservation_date")
      .dropColumn("reservation_time")
      .dropColumn("party_size")
      .dropColumn("status")
      .execute();
  }
}

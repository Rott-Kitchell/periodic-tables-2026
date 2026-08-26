import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("tables")
    .addColumn("table_id", "serial", (col) => col.primaryKey())
    .addColumn("table_name", "varchar")
    .addColumn("capacity", "integer", (col) => col.unsigned())
    .addColumn("reservation_id", "integer", (col) =>
      col
        .unsigned()
        .defaultTo(null)
        .references("reservations.reservation_id")
        .onDelete("cascade"),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("reservations").execute();
}

import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("tables")
    .ifNotExists()
    .addColumn("table_id", "serial", (col) => col.primaryKey())
    .addColumn("table_name", "varchar", (col) => col.notNull())
    .addColumn("capacity", "integer", (col) =>
      col.notNull().check(sql`capacity > 0`),
    )
    .addColumn("reservation_id", "integer", (col) =>
      col

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
  await db.schema.dropTable("tables").execute();
}

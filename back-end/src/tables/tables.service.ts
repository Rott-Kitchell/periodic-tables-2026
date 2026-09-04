import { db } from "../db/config.js";
import type { NewTable, UpdatedTable, Table } from "../types.js";

function read(tableId: Table["table_id"]) {
  return db
    .selectFrom("tables as t")
    .where("t.table_id", "=", tableId)
    .executeTakeFirst();
}

function list() {
  return db
    .selectFrom("tables")
    .selectAll()
    .orderBy("table_name", "asc")
    .execute();
}

function update(updatedTable: UpdatedTable) {
  return db
    .updateTable("tables")
    .set(updatedTable)
    .where("table_id", "=", updatedTable.table_id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

function create(table: NewTable) {
  return db
    .insertInto("tables")
    .values(table)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export { read, list, update, create };

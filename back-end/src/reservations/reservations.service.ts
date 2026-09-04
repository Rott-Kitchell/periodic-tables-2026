import { sql } from "kysely";
import { db } from "../db/config.js";
import type {
  NewReservation,
  UpdatedReservation,
  Reservation,
} from "../types.js";

function list() {
  return db
    .selectFrom("reservations")
    .selectAll()
    .orderBy("reservation_date")
    .orderBy("reservation_time")
    .execute();
}

function listByDate(reservation_date: Reservation["reservation_date"]) {
  return db
    .selectFrom("reservations")
    .selectAll()
    .where("reservation_date", "=", reservation_date)
    .where("status", "!=", "finished")
    .orderBy("reservation_time")
    .execute();
}

function create(reservation: NewReservation) {
  return db
    .insertInto("reservations")
    .values(reservation)
    .returningAll()
    .executeTakeFirstOrThrow();
}

function read(reservation_id: Reservation["reservation_id"]) {
  return db
    .selectFrom("reservations as r")
    .selectAll()
    .where("r.reservation_id", "=", reservation_id)
    .executeTakeFirst();
}

function update(updatedRes: UpdatedReservation) {
  return db
    .updateTable("reservations")
    .set(updatedRes)
    .where("reservation_id", "=", updatedRes.reservation_id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

function search(mobile_number: Reservation["mobile_number"]) {
  const digits = mobile_number.replace(/\D/g, "");
  return db
    .selectFrom("reservations")
    .where(
      sql<boolean>`translate(mobile_number, '() -', '') like ${`%${digits}%`}`,
    )
    .orderBy("reservation_date")
    .execute();
}

export { list, listByDate, create, read, update, search };

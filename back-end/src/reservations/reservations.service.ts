import { sql } from "kysely";
import { db } from "../db/config.js";
import type { NewReservation } from "../types.js";

// function list() {
//   return knex("reservations")
//     .select("*")
//     .orderBy(["reservation_date", "reservation_time"]);
// } *DONE*

function list() {
  return db
    .selectFrom("reservations")
    .selectAll()
    .orderBy("reservation_date")
    .orderBy("reservation_time")
    .execute();
}

// function listByDate(reservation_date) {
//   return knex("reservations")
//     .select("*")
//     .where({ reservation_date })
//     .whereNot({ status: "finished" })
//     .orderBy("reservation_time");
// } *DONE*
function listByDate(reservation_date: string) {
  return db
    .selectFrom("reservations")
    .selectAll()
    .where("reservation_date", "=", reservation_date)
    .where("status", "!=", "finished")
    .orderBy("reservation_time")
    .execute();
}

// function create(reservation) {
//   return knex("reservations")
//     .insert(reservation)
//     .returning("*")
//     .then((createdRecords) => createdRecords[0]);
// }
function create(reservation: NewReservation) {
  return db
    .insertInto("reservations")
    .values(reservation)
    .returningAll()
    .executeTakeFirstOrThrow();
}

// function read(reservation_id) {
//   return knex("reservations")
//     .select("*")
//     .where({ reservation_id: reservation_id })
//     .first();
// } *DONE*

function read(reservation_id: number) {
  return db
    .selectFrom("reservations")
    .where("reservation_id", "=", reservation_id)
    .executeTakeFirst();
}

// function update(updatedRes) {
//   return knex("reservations")
//     .select("*")
//     .where({ reservation_id: updatedRes.reservation_id })
//     .update(updatedRes, "*")
//     .then((updatedRecords) => updatedRecords[0]);
// }

// function search(mobile_number) {
//   return knex("reservations")
//     .whereRaw(
//       "translate(mobile_number, '() -', '') like ?",
//       `%${mobile_number.replace(/\D/g, "")}%`,
//     )
//     .orderBy("reservation_date");
// } *DONE*

function search(mobile_number: string) {
  const digits = mobile_number.replace(/\D/g, "");
  return db
    .selectFrom("reservations")
    .where(
      sql<boolean>`translate(mobile_number, '() -', '') like ${`%${digits}%`}`,
    )
    .orderBy("reservation_date")
    .execute();
}

export { list, listByDate, create, read, search };

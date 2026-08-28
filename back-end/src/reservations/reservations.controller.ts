import { createMiddleware } from "hono/factory";
import * as reservationsService from "./reservations.service.js";
import { HTTPException } from "hono/http-exception";

// const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const reservationValidator = require("../util/reservationValidator");
// const reservationsService = require("./reservations.service");

// async function reservationExists(req, res, next) {
//   const { reservationId } = req.params;
//   const reservation = await reservationsService.read(reservationId);
//   if (reservation) {
//     res.locals.reservation = reservation;
//     return next();
//   }
//   return next({
//     status: 404,
//     message: `Reservation ${reservationId} cannot be found.`,
//   });
// }

const reservationExists = createMiddleware(async (c, next) => {
  const reservationId = c.req.param("reservationId");
  const reservation = await reservationsService.read(Number(reservationId));
  if (!reservation) {
    throw new HTTPException(404, {
      message: `Reservation ${reservationId} cannot be found.`,
    });
  }

  c.set("reservation", reservation);
  await next();
});

// function hasValidFields(req, res, next) {
//   const { data = {} } = req.body;

//   const invalidFields = reservationValidator(data);

//   if (invalidFields.length) {
//     return next({
//       status: 400,
//       message: `Invalid reservation field(s): ${invalidFields.join(", ")}`,
//     });
//   }

//   const reserveDate = new Date(
//       `${data.reservation_date} ${data.reservation_time} GMT-0500`,
//     ),
//     start = new Date(`${data.reservation_date} 10:30:00 GMT-0500`),
//     end = new Date(`${data.reservation_date} 21:30:00 GMT-0500`);

//   const todaysDate = new Date();

//   if (reserveDate.getDay() === 2) {
//     return next({
//       status: 400,
//       message:
//         "Reservations cannot be made on a Tuesday (Restaurant is closed).",
//     });
//   }
//   if (reserveDate < todaysDate) {
//     return next({
//       status: 400,
//       message: "Reservations must be made in the future.",
//     });
//   }
//   if (
//     reserveDate.getTime() < start.getTime() ||
//     reserveDate.getTime() > end.getTime()
//   ) {
//     return next({
//       status: 400,
//       message: "Reservations cannot be made outside of 10:30am to 9:30pm.",
//     });
//   }

//   if (data.status && data.status !== "booked") {
//     return next({
//       status: 400,
//       message: `Status cannot be ${data.status}`,
//     });
//   }

//   next();
// }

// async function list(req, res, next) {
//   const reservationDate = req.query.date;
//   const data = reservationDate
//     ? await reservationsService.listByDate(reservationDate)
//     : await reservationsService.search(req.query.mobile_number);

//   res.json({ data });
// } *DONE*

const list = createMiddleware(async (c) => {
  const reservationDate = c.req.query("date");
  if (reservationDate) {
    const data = await reservationsService.listByDate(reservationDate);
    return c.json({ data });
  }

  const mobileNumber = c.req.query("mobile_number");

  if (!mobileNumber) {
    return c.json(
      { error: "A date or mobile_number query parameter is required." },
      400,
    );
  }

  const data = await reservationsService.search(mobileNumber);
  c.json({ data });
});

// async function create(req, res, next) {
//   let reservation = req.body.data;
//   const data = await reservationsService.create(reservation);
//   res.status(201).json({ data });
// }

const create = createMiddleware(async (c) => {
  let reservation = await c.req.json();
  const data = await reservationsService.create(reservation);
  c.json({ data }, 201);
});

// async function read(req, res, next) {
//   const { reservation } = res.locals;
//   res.json({ data: reservation });
// }

const read = createMiddleware(async (c) => {
  const reservation = c.get("reservation");
  c.json({ data: reservation });
});

// async function updateStatus(req, res, next) {
//   const {
//     data: { status },
//   } = req.body;
//   const { reservation } = res.locals;
//   if (reservation.status === "finished") {
//     return next({
//       status: 400,
//       message: `a finished reservation cannot be updated`,
//     });
//   }

//   if (!["booked", "seated", "finished", "cancelled"].includes(status)) {
//     return next({
//       status: 400,
//       message: `Status cannot be ${status}`,
//     });
//   }

//   const updatedRes = {
//     ...reservation,
//     status: status,
//   };

//   const newData = await reservationsService.update(updatedRes);

//   res.status(200).json({ data: newData });
// }

// async function update(req, res, next) {
//   const { data } = req.body;
//   const { reservation } = res.locals;

//   const updatedRes = {
//     ...reservation,
//     ...data,
//   };

//   const newData = await reservationsService.update(updatedRes);

//   res.status(200).json({ data: newData });
// }

// module.exports = {
//   list: asyncErrorBoundary(list),
//   create: [asyncErrorBoundary(hasValidFields), asyncErrorBoundary(create)],
//   read: [asyncErrorBoundary(reservationExists), read],
//   updateStatus: [
//     asyncErrorBoundary(reservationExists),
//     asyncErrorBoundary(updateStatus),
//   ],
//   update: [
//     asyncErrorBoundary(hasValidFields),
//     asyncErrorBoundary(reservationExists),
//     asyncErrorBoundary(update),
//   ],
// };

export { list, create, reservationExists, read };

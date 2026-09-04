import { createMiddleware, createFactory } from "hono/factory";
import * as reservationsService from "./reservations.service.js";
import { HTTPException } from "hono/http-exception";
import { reservationValidator } from "../utils/validators.js";
import type { Context } from "hono";
const factory = createFactory();

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

const list = async (c: Context) => {
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
};

const create = factory.createHandlers(reservationValidator, async (c) => {
  const body = c.req.valid("json");
  let reservation = body.data;
  const data = await reservationsService.create(reservation);
  return c.json({ data }, 201);
});

const read = factory.createHandlers(reservationExists, (c) => {
  const reservation = c.var.reservation;
  return c.json({ data: reservation });
});

const updateStatus = factory.createHandlers(reservationExists, async (c) => {
  const {
    data: { status },
  } = await c.req.json();
  const reservation = c.var.reservation;

  if (reservation.status === "finished") {
    return c.json(
      {
        error: `a finished reservation cannot be updated`,
      },
      400,
    );
  }
  if (!["booked", "seated", "finished", "cancelled"].includes(status)) {
    return c.json(
      {
        error: `Status cannot be ${status}`,
      },
      400,
    );
  }

  const updatedRes = {
    ...reservation,
    status: status,
  };

  const newData = await reservationsService.update(updatedRes);

  return c.json({ newData }, 201);
});

const update = factory.createHandlers(
  reservationValidator,
  reservationExists,
  async (c) => {
    const body = c.req.valid("json");
    const reservation = c.var.reservation;

    const updatedRes = { ...reservation, ...body };

    const newData = await reservationsService.update(updatedRes);

    return c.json({ newData }, 201);
  },
);

export { list, create, read, updateStatus, update };

import { createMiddleware, createFactory } from "hono/factory";
import * as reservationsService from "../reservations/reservations.service.js";
import * as tablesService from "./tables.service.js";
import { tableValidator } from "../utils/validators.js";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { UpdatedReservation, UpdatedTable } from "../types.js";
const factory = createFactory();

const tableExists = createMiddleware(async (c, next) => {
  const tableId = c.req.param("tableId");
  const table = await tablesService.read(Number(tableId));
  if (!table) {
    throw new HTTPException(404, {
      message: `Table ${tableId} cannot be found.`,
    });
  }

  c.set("table", table);
  await next();
});

const seatTable = factory.createHandlers(tableExists, async (c) => {
  let table = c.var.table;
  const { data } = await c.req.json();

  if (!data || !data.reservation_id) {
    return c.json(
      {
        error: `No reservation_id/data`,
      },
      400,
    );
  }

  const reservation = await reservationsService.read(data.reservation_id);
  if (!reservation) {
    return c.json(
      {
        error: `Reservation ${data.reservation_id} does not exist`,
      },
      404,
    );
  }
  if (table.reservation_id !== null) {
    return c.json(
      {
        error: `Table occupied`,
      },
      400,
    );
  }
  if (reservation.party_size > table.capacity) {
    return c.json(
      {
        error: `Table does not have the capacity`,
      },
      400,
    );
  }

  const updatedTable: UpdatedTable = {
    ...table,
    ...data,
  };

  if (["seated", "finished"].includes(reservation.status)) {
    return c.json(
      {
        error: `Reservation already ${reservation.status}`,
      },
      400,
    );
  }

  const updatedRes: UpdatedReservation = {
    ...reservation,
    reservation_id: reservation?.reservation_id,
    status: "seated",
  };

  const newData = await tablesService.update(updatedTable);
  if (newData) await reservationsService.update(updatedRes);
  c.json({ data: newData });
});

const list = async (c: Context) => {
  const data = await tablesService.list();
  c.json({ data });
};

const create = factory.createHandlers(tableValidator, async (c) => {
  const body = c.req.valid("json");
  let table = body.data;
  const data = await tablesService.create(table);
  return c.json({ data }, 201);
});

const freeUpTable = factory.createHandlers(tableExists, async (c) => {
  const table = c.var.table;

  if (!table.reservation_id) {
    return c.json({ error: `Table not occupied` }, 400);
  }

  let updatedTable: UpdatedTable = {
    ...table,
    reservation_id: null,
  };
  const reservation = await reservationsService.read(table.reservation_id);
  if (!reservation) {
    throw new HTTPException(404, {
      message: `Reservation ${table.reservation_id} cannot be found.`,
    });
  }
  const updatedRes: UpdatedReservation = {
    ...reservation,
    reservation_id: reservation?.reservation_id,
    status: "finished",
  };
  const newData = await tablesService.update(updatedTable);
  if (newData) await reservationsService.update(updatedRes);
  c.json({ data: newData });
});

export { list, seatTable, create, freeUpTable };

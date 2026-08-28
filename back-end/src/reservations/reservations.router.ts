import { Hono } from "hono";
import { reservationValidator } from "../utils/validators.js";
import * as controller from "./reservations.controller.js";

const reservationsRouter = new Hono();

reservationsRouter
  .get("/", controller.list)
  .post(reservationValidator, controller.create);

reservationsRouter.get(
  "/:reservationId",
  controller.reservationExists,
  controller.read,
);

export default reservationsRouter;

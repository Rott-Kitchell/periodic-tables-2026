import { Hono } from "hono";
import { reservationValidator } from "../utils/validators.js";
import * as controller from "./reservations.controller.js";
import type { Kysely } from "kysely";
import type { Database } from "../types.js";

type Env = {
  Variables: {
    db: Kysely<Database>;
  };
};

const reservationsRouter = new Hono<Env>();

reservationsRouter.get("/", controller.list).post(...controller.create);

reservationsRouter.get("/:reservationId", ...controller.read);

export default reservationsRouter;

import { Hono } from "hono";
import type { Kysely } from "kysely";
import type { Database } from "../types.js";
import * as controller from "./tables.controller.js";

type Env = {
  Variables: {
    db: Kysely<Database>;
  };
};

const tablesRouter = new Hono<Env>();

tablesRouter.get("/", controller.list).post(...controller.create);
tablesRouter
  .put("/:tableId/seat", ...controller.seatTable)
  .delete(...controller.freeUpTable);

export default tablesRouter;

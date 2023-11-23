import { Router } from "express";

import { HandleUserController } from "../../../../modules/gerenciamento/services/HandleUserService/HandleUserController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersRoutes = Router();

const handleUserController = new HandleUserController();

usersRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleUserController.create
);

usersRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleUserController.list
);

usersRoutes.get("/me", ensureAuthenticated, handleUserController.findUser);

usersRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleUserController.findById
);

usersRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleUserController.update
);

usersRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleUserController.delete
);

export { usersRoutes };

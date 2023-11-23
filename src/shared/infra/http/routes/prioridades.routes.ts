import { Router } from "express";
import multer from "multer";

import { HandlePrioridadeController } from "../../../../modules/dinamica/services/HandlePrioridadeService/HandlePrioridadeController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const prioridadeRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handlePrioridadeController = new HandlePrioridadeController();

prioridadeRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handlePrioridadeController.create
);

prioridadeRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handlePrioridadeController.update
);

prioridadeRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handlePrioridadeController.read
);

prioridadeRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handlePrioridadeController.delete
);

prioridadeRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handlePrioridadeController.import
);

export { prioridadeRoutes };

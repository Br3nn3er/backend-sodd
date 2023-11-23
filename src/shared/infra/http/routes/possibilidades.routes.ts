import { Router } from "express";
import multer from "multer";

import { HandlePossibilidadesController } from "../../../../modules/dinamica/services/HandlePossibilidadesService/HandlePossibilidadesController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const possibilidadeRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handlePossibilidadesController = new HandlePossibilidadesController();

possibilidadeRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handlePossibilidadesController.create
);

possibilidadeRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handlePossibilidadesController.read
);

possibilidadeRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handlePossibilidadesController.update
);

possibilidadeRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handlePossibilidadesController.delete
);

possibilidadeRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handlePossibilidadesController.import
);

export { possibilidadeRoutes };

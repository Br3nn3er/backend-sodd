import { Router } from "express";
import multer from "multer";

import { HandleAuditoriaFilaController } from "../../../../modules/dinamica/services/HandleAuditoriaFilaService/HandleAuditoriaFilaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const auditoriaFilaRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleAuditoriaFilaController = new HandleAuditoriaFilaController();

auditoriaFilaRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaController.create
);

auditoriaFilaRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaController.update
);

auditoriaFilaRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaController.read
);

auditoriaFilaRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaController.delete
);

auditoriaFilaRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaController.import
);

export { auditoriaFilaRoutes };

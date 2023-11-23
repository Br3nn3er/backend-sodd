import { Router } from "express";
import multer from "multer";

import { HandleAuditoriaFilaNewController } from "../../../../modules/dinamica/services/HandleAuditoriaFilaNewService/HandleAuditoriaFilaNewController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const auditoriaFilaNewRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleAuditoriaFilaNewController = new HandleAuditoriaFilaNewController();

auditoriaFilaNewRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaNewController.create
);

auditoriaFilaNewRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaNewController.update
);

auditoriaFilaNewRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaNewController.read
);

auditoriaFilaNewRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaNewController.delete
);

auditoriaFilaNewRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaFilaNewController.import
);

export { auditoriaFilaNewRoutes };

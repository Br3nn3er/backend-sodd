import { Router } from "express";
import multer from "multer";

import { HandleEtapaController } from "../../../../modules/dinamica/services/HandleEtapaService/HandleEtapaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const etapaRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleEtapaController = new HandleEtapaController();

etapaRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleEtapaController.create
);

etapaRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleEtapaController.update
);

etapaRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleEtapaController.read
);

etapaRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleEtapaController.delete
);

etapaRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleEtapaController.import
);

export { etapaRoutes };

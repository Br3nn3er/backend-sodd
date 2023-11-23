import { Router } from "express";
import multer from "multer";

import { HandleStatusPossibilidadesController } from "../../../../modules/dinamica/services/HandleStatusPossibilidadesService/HandleStatusPossibilidadesController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const statusPossibilidadesRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleStatusPossibilidadesController =
  new HandleStatusPossibilidadesController();

statusPossibilidadesRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleStatusPossibilidadesController.create
);

statusPossibilidadesRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleStatusPossibilidadesController.read
);

statusPossibilidadesRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleStatusPossibilidadesController.delete
);

statusPossibilidadesRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleStatusPossibilidadesController.import
);

export { statusPossibilidadesRoutes };

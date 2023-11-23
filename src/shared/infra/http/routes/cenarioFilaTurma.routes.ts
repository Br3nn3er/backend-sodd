import { Router } from "express";
import multer from "multer";

import { HandleCenarioFilaTurmaController } from "../../../../modules/dinamica/services/HandleCenarioFilaTurmaService/HandleCenarioFilaTurmaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const cenarioFilaTurmaRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleCenarioFilaTurmaController = new HandleCenarioFilaTurmaController();

cenarioFilaTurmaRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioFilaTurmaController.create
);

cenarioFilaTurmaRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioFilaTurmaController.update
);

cenarioFilaTurmaRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioFilaTurmaController.read
);

cenarioFilaTurmaRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioFilaTurmaController.delete
);

cenarioFilaTurmaRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioFilaTurmaController.import
);

export { cenarioFilaTurmaRoutes };

import { Router } from "express";
import multer from "multer";

import { HandleCenarioController } from "../../../../modules/dinamica/services/HandleCenarioService/HandleCenarioController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const cenarioRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleCenarioController = new HandleCenarioController();

cenarioRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioController.create
);

cenarioRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioController.read
);

cenarioRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioController.update
);

cenarioRoutes.delete(
  "/:num_cenario",
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioController.delete
);

cenarioRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleCenarioController.import
);

export { cenarioRoutes };

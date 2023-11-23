import { Router } from "express";
import multer from "multer";

import { HandleDistribuicaoCargaController } from "../../../../modules/dinamica/services/HandleDistribuicaoCargaService/HandleDistribuicaoCargaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const distRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleDistribuicaoCargaController =
  new HandleDistribuicaoCargaController();

distRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleDistribuicaoCargaController.create
);

distRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleDistribuicaoCargaController.read
);

distRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleDistribuicaoCargaController.update
);

distRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleDistribuicaoCargaController.delete
);

distRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleDistribuicaoCargaController.import
);

export { distRoutes };

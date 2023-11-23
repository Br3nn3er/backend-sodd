import { Router } from "express";
import multer from "multer";

import { HandleCargaDocenteController } from "../../../../modules/estrutura/services/HandleCargaDocenteService/HandleCargaDocenteController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const cargasRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleCargaDocenteController = new HandleCargaDocenteController();

cargasRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCargaDocenteController.create
);

cargasRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCargaDocenteController.read
);

cargasRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCargaDocenteController.update
);

cargasRoutes.delete(
  "/:siape",
  ensureAuthenticated,
  ensureAdmin,
  handleCargaDocenteController.deleteBySiape
);

cargasRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleCargaDocenteController.import
);

export { cargasRoutes };

import { Router } from "express";
import multer from "multer";

import { HandleCursoController } from "../../../../modules/estrutura/services/HandleCursoService/HandleCursoController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const cursosRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleCursoController = new HandleCursoController();

cursosRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCursoController.create
);

cursosRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCursoController.read
);

cursosRoutes.get(
  "/:codigo",
  ensureAuthenticated,
  ensureAdmin,
  handleCursoController.readByCodigo
);

cursosRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleCursoController.update
);

cursosRoutes.delete(
  "/:codigo",
  ensureAuthenticated,
  ensureAdmin,
  handleCursoController.delete
);

cursosRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleCursoController.import
);

export { cursosRoutes };

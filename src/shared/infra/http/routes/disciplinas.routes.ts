import { Router } from "express";
import multer from "multer";

import { HandleDisciplinaController } from "../../../../modules/estrutura/services/HandleDisciplinaService/HandleDisciplinaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const disciplinasRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleDisciplinaController = new HandleDisciplinaController();

disciplinasRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleDisciplinaController.create
);

disciplinasRoutes.get(
  "/",
  ensureAuthenticated,
  handleDisciplinaController.read
);

disciplinasRoutes.get(
  "/:codigo",
  ensureAuthenticated,
  ensureAdmin,
  handleDisciplinaController.readByCodigo
);

// disciplinasRoutes.get(
//   "/professor/:siape/ano/:ano/semestre/:semestre",
//   ensureAuthenticated,
//   handleDisciplinaController.readBySiapeEAnoESemestre
// );

disciplinasRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleDisciplinaController.update
);

disciplinasRoutes.delete(
  "/:codigo",
  ensureAuthenticated,
  ensureAdmin,
  handleDisciplinaController.delete
);

disciplinasRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleDisciplinaController.import
);

export { disciplinasRoutes };

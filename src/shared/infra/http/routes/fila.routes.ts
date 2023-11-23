import { Router } from "express";
import multer from "multer";

import { HandleFilaController } from "../../../../modules/dinamica/services/HandleFilaService/HandleFilaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const filaRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleFilaController = new HandleFilaController();

filaRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaController.create
);

filaRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaController.update
);

filaRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaController.read
);

filaRoutes.get(
  "/disciplina/:codigo/semestre/:semestreId",
  ensureAuthenticated,
  handleFilaController.readByDiscEAnoESemestre
);

filaRoutes.get(
  "/professor/:siape/semestre/:semestreId",
  ensureAuthenticated,
  handleFilaController.readByProfessorESemestre
);

filaRoutes.get(
  "/professor/:siape",
  ensureAuthenticated,
  handleFilaController.readByProfessor
);

filaRoutes.get(
  "/turma/:turma",
  ensureAuthenticated,
  handleFilaController.readByTurma
);

filaRoutes.get(
  "/professor/:siape/ano/:ano/semestre/:semestre",
  ensureAuthenticated,
  handleFilaController.readBySemestreEProfessor
);

filaRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaController.delete
);

filaRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleFilaController.import
);

export { filaRoutes };

import { Router } from "express";
import multer from "multer";

import { HandleMinistraController } from "../../../../modules/estrutura/services/HandleMinistraService/HandleMinistraController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const ministraRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleMinistraController = new HandleMinistraController();

ministraRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleMinistraController.create
);

ministraRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleMinistraController.read
);

ministraRoutes.get(
  "/professor/semestre/:semestre",
  ensureAuthenticated,
  handleMinistraController.readByProfessorAndSemestre
);

ministraRoutes.get(
  "/turma/semestre/:semestre",
  ensureAuthenticated,
  handleMinistraController.readByTurmaAndSemestre
);

ministraRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleMinistraController.delete
);

ministraRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleMinistraController.import
);

export { ministraRoutes };

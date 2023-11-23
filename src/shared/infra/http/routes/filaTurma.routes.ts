import { Router } from "express";

import { HandleFilaTurmaController } from "../../../../modules/dinamica/services/HandleFilaTurmaService/HandleFilaTurmaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const filaTurmaRoutes = Router();

const handleFilaTurmaController = new HandleFilaTurmaController();

filaTurmaRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaTurmaController.create
);

filaTurmaRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaTurmaController.update
);

filaTurmaRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaTurmaController.read
);

filaTurmaRoutes.get(
  "/professor/:siape",
  ensureAuthenticated,
  handleFilaTurmaController.readByProfessor
);

filaTurmaRoutes.get(
  "/turma/:id_turma",
  ensureAuthenticated,
  handleFilaTurmaController.readByTurma
);

filaTurmaRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaTurmaController.delete
);

export { filaTurmaRoutes };

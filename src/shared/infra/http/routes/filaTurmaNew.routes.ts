import { Router } from "express";
import multer from "multer";

import { HandleFilaTurmaNewController } from "../../../../modules/dinamica/services/HandleFilaTurmaNewService/HandleFilaTurmaNewController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const filaTurmaNewRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleFilaTurmaNewController = new HandleFilaTurmaNewController();

filaTurmaNewRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaTurmaNewController.create
);

filaTurmaNewRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaTurmaNewController.update
);

filaTurmaNewRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaTurmaNewController.read
);

filaTurmaNewRoutes.get(
  "/professor/semestre/:semestreId",
  ensureAuthenticated,
  handleFilaTurmaNewController.readFromLoggedUserBySemestreId
);

filaTurmaNewRoutes.get(
  "/professor/:siape/semestre/:semestreId",
  ensureAuthenticated,
  handleFilaTurmaNewController.readByProfessorAndSemestreId
);

filaTurmaNewRoutes.get(
  "/turma/:turmaID",
  ensureAuthenticated,
  handleFilaTurmaNewController.readByTurma
);

filaTurmaNewRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleFilaTurmaNewController.delete
);

filaTurmaNewRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleFilaTurmaNewController.import
);

export { filaTurmaNewRoutes };

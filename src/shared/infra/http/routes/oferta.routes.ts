import { Router } from "express";
import multer from "multer";

import { HandleOfertaController } from "../../../../modules/dinamica/services/HandleOfertaService/HandleOfertaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const ofertaRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleOfertaController = new HandleOfertaController();

ofertaRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleOfertaController.create
);

ofertaRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleOfertaController.read
);

ofertaRoutes.get(
  "/turma/:turmaId/semestre/:semestreId",
  ensureAuthenticated,
  handleOfertaController.readByTurmaIdAndSemestreId
);

ofertaRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleOfertaController.delete
);

ofertaRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleOfertaController.import
);

export { ofertaRoutes };

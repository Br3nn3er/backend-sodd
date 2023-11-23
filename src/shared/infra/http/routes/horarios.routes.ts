import { Router } from "express";
import multer from "multer";

import { HandleHorarioController } from "../../../../modules/estrutura/services/HandleHorarioService/HandleHorarioController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const horariosRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleHorarioController = new HandleHorarioController();

horariosRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleHorarioController.create
);

horariosRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleHorarioController.update
);

horariosRoutes.get("/", ensureAuthenticated, handleHorarioController.read);

horariosRoutes.delete(
  "/:letra",
  ensureAuthenticated,
  ensureAdmin,
  handleHorarioController.delete
);

horariosRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleHorarioController.import
);

export { horariosRoutes };

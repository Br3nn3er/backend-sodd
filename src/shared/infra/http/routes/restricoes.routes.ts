import { Router } from "express";
import multer from "multer";

import { HandleRestricoesController } from "../../../../modules/dinamica/services/HandleRestricoesService/HandleRestricoesController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const restricoesRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleRestricoesController = new HandleRestricoesController();

restricoesRoutes.post(
  "/",
  ensureAuthenticated,
  handleRestricoesController.create
);

restricoesRoutes.get("/", ensureAuthenticated, handleRestricoesController.read);

restricoesRoutes.get(
  "/professor/:siape",
  ensureAuthenticated,
  handleRestricoesController.readBySiape
);

restricoesRoutes.delete(
  "/",
  ensureAuthenticated,
  handleRestricoesController.delete
);

restricoesRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleRestricoesController.import
);

export { restricoesRoutes };

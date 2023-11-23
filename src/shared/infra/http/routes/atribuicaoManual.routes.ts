import { Router } from "express";
import multer from "multer";

import { HandleAtribuicaoManualController } from "../../../../modules/dinamica/services/HandleAtribuicaoManualService/HandleAtribuicaoManualController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const atribuicaoManualRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleAtribuicaoManualController = new HandleAtribuicaoManualController();

atribuicaoManualRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAtribuicaoManualController.create
);

atribuicaoManualRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAtribuicaoManualController.read
);

atribuicaoManualRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAtribuicaoManualController.delete
);

atribuicaoManualRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleAtribuicaoManualController.import
);

export { atribuicaoManualRoutes };

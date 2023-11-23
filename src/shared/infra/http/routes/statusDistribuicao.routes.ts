import { Router } from "express";
import multer from "multer";

import { HandleStatusDistribuicaoController } from "../../../../modules/dinamica/services/HandleStatusDistribuicaoService/HandleStatusDistribuicaoController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const statusDistribuicaoRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleStatusDistribuicaoController =
  new HandleStatusDistribuicaoController();

statusDistribuicaoRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleStatusDistribuicaoController.create
);

statusDistribuicaoRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleStatusDistribuicaoController.update
);

statusDistribuicaoRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleStatusDistribuicaoController.read
);

statusDistribuicaoRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleStatusDistribuicaoController.delete
);

statusDistribuicaoRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleStatusDistribuicaoController.import
);

export { statusDistribuicaoRoutes };

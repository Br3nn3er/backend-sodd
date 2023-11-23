import { Router } from "express";
import multer from "multer";

import { HandleSemanaController } from "../../../../modules/estrutura/services/HandleSemanaService/HandleSemanaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const semanasRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleSemanaController = new HandleSemanaController();

semanasRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleSemanaController.create
);

semanasRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleSemanaController.read
);

semanasRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleSemanaController.update
);

semanasRoutes.delete(
  "/:dia",
  ensureAuthenticated,
  ensureAdmin,
  handleSemanaController.delete
);

semanasRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleSemanaController.import
);

export { semanasRoutes };

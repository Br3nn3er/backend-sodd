import { Router } from "express";
import multer from "multer";

import { HandleTurmaController } from "../../../../modules/estrutura/services/HandleTurmaService/HandleTurmaController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const turmasRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleTurmaController = new HandleTurmaController();

turmasRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleTurmaController.create
);

turmasRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleTurmaController.update
);

turmasRoutes.get("/", ensureAuthenticated, handleTurmaController.read);

turmasRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleTurmaController.delete
);

turmasRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleTurmaController.import
);

export { turmasRoutes };

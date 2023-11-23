import { Router } from "express";
import multer from "multer";

import { HandleProfessorController } from "../../../../modules/estrutura/services/HandleProfessorService/HandleProfessorController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const professoresRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleProfessorController = new HandleProfessorController();

professoresRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleProfessorController.create
);

professoresRoutes.get("/", ensureAuthenticated, handleProfessorController.read);

professoresRoutes.get(
  "/:siape",
  ensureAuthenticated,
  ensureAdmin,
  handleProfessorController.readBySiape
);

professoresRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleProfessorController.update
);

professoresRoutes.delete(
  "/:siape",
  ensureAuthenticated,
  ensureAdmin,
  handleProfessorController.delete
);

professoresRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleProfessorController.import
);

export { professoresRoutes };

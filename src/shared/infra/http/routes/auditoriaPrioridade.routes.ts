import { Router } from "express";
import multer from "multer";

import { HandleAuditoriaPrioridadeController } from "../../../../modules/dinamica/services/HandleAuditoriaPrioridadeService/HandleAuditoriaPrioridadeController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const auditoriaPrioridadeRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleAuditoriaPrioridadeController =
  new HandleAuditoriaPrioridadeController();

auditoriaPrioridadeRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaPrioridadeController.create
);

auditoriaPrioridadeRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaPrioridadeController.update
);

auditoriaPrioridadeRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaPrioridadeController.read
);

auditoriaPrioridadeRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaPrioridadeController.delete
);

auditoriaPrioridadeRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleAuditoriaPrioridadeController.import
);

export { auditoriaPrioridadeRoutes };

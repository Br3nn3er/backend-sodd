import { Router } from "express";
import multer from "multer";

import { HandleSemestreController } from "../../../../modules/estrutura/services/HandleSemestreService/HandleSemestreController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const semestresRoutes = Router();

const upload = multer({ dest: "./tmp" });

const handleSemestreController = new HandleSemestreController();

semestresRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleSemestreController.create
);

semestresRoutes.get("/", ensureAuthenticated, handleSemestreController.read);

semestresRoutes.get(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleSemestreController.readById
);

semestresRoutes.patch(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleSemestreController.update
);

semestresRoutes.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  handleSemestreController.delete
);

semestresRoutes.post(
  "/import",
  upload.single("file"),
  ensureAuthenticated,
  ensureAdmin,
  handleSemestreController.import
);

export { semestresRoutes };

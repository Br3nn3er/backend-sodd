import { Router } from "express";

import { HandleDistribuicoesPossibilidadeController } from "../../../../modules/dinamica/services/HandleDistribuicoesPossibilidadeService/HandleDistribuicoesPossibilidadeController";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const distPossibilidadeRoutes = Router();

const handleDistribuicoesPossibilidadeController =
  new HandleDistribuicoesPossibilidadeController();

distPossibilidadeRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleDistribuicoesPossibilidadeController.create
);

distPossibilidadeRoutes.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleDistribuicoesPossibilidadeController.read
);

distPossibilidadeRoutes.delete(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  handleDistribuicoesPossibilidadeController.delete
);

export { distPossibilidadeRoutes };

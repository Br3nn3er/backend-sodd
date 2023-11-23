import { Router } from "express";

import { HandleRefreshTokenController } from "../../../../modules/gerenciamento/services/handleRefreshTokenService/HandleRefreshTokenController";
import { HandleUserController } from "../../../../modules/gerenciamento/services/HandleUserService/HandleUserController";

const authenticateRoutes = Router();

const authenticateUserController = new HandleUserController();
const handleRefreshTokenController = new HandleRefreshTokenController();

authenticateRoutes.post("/sessions", authenticateUserController.authenticate);
authenticateRoutes.post("/refresh-token", handleRefreshTokenController.refresh);

export { authenticateRoutes };

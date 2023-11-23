import { Router } from "express";

import { HandleSendMailController } from "../../../../modules/gerenciamento/services/HandleSendMailService/HandleSendMailController";

const passwordRoutes = Router();

const handleSendMailController = new HandleSendMailController();

passwordRoutes.post("/forgot", handleSendMailController.sendForgotPasswordMail);
passwordRoutes.post("/reset", handleSendMailController.resetPassword);

export { passwordRoutes };

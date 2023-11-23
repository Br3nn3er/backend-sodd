import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleSendMailService } from "./HandleSendMailService";

class HandleSendMailController {
  async sendForgotPasswordMail(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { email } = request.body;

    const handleSendMailService = container.resolve(HandleSendMailService);
    await handleSendMailService.sendForgotPasswordMail(email);

    return response.status(201).json({ message: "Email enviado!" });
  }

  async resetPassword(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    const handleSendMailService = container.resolve(HandleSendMailService);

    await handleSendMailService.resetPassword({
      token: String(token),
      password,
    });

    return response
      .status(201)
      .json({ message: "Nova senha cadastrada com sucesso!" });
  }
}

export { HandleSendMailController };

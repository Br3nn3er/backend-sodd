import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { container } from "tsyringe";

import auth from "../../../../config/auth";
import { IRequestWithUser } from "../../../../config/types";
import { HandleUserService } from "../../../../modules/gerenciamento/services/HandleUserService/HandleUserService";
import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não encontrado!", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, auth.secret_token) as IPayload;
    const userService = container.resolve(HandleUserService);
    (request as IRequestWithUser).user = await userService.getCurrentUserInfo(
      user_id
    );

    next();
  } catch {
    throw new AppError("Token invalido!", 401);
  }
}

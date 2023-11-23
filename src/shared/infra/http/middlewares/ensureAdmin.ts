import { Response, NextFunction } from "express";

import { IRequestWithUser } from "../../../../config/types";
import { UsersRepository } from "../../../../modules/gerenciamento/infra/typeorm/repositories/UsersRepository";
import { AppError } from "../../../errors/AppError";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function ensureAdmin(
  request: IRequestWithUser,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  const usersRepository = new UsersRepository();

  const user = await usersRepository.queryById(id);

  if (!user.isAdmin) {
    throw new AppError("Usuário não é um administrador!", 403);
  }

  return next();
}

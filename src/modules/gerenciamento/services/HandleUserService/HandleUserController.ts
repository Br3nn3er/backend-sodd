import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";

import { IRequestWithUser } from "../../../../config/types";
import { ICreateUsersDTO } from "../../dtos/ICreateUpdateUsersDTO";
import { HandleUserService } from "./HandleUserService";

class HandleUserController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, isAdmin, siape } = request.body;

    const handleUserService = container.resolve(HandleUserService);
    const data: ICreateUsersDTO = { name, email, password, isAdmin, siape };

    if (isAdmin) delete data.siape;

    await handleUserService.create(data);

    return response
      .status(201)
      .json({ message: "Usuario criado com sucesso!" });
  }

  async list(request: Request, response: Response): Promise<Response> {
    const handleUserService = container.resolve(HandleUserService);

    const listUsers = await handleUserService.list();

    return response.json(listUsers);
  }

  async findById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const handleUserService = container.resolve(HandleUserService);

    const user = await handleUserService.getCurrentUserInfo(id);

    return response.json(user);
  }

  async findUser(
    request: IRequestWithUser,
    response: Response
  ): Promise<Response> {
    const { id } = request.user;

    const handleUserService = container.resolve(HandleUserService);

    const userFounded = await handleUserService.getCurrentUserInfo(id);

    return response.json(userFounded);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id, name, isAdmin } = request.body;

    const handleUserService = container.resolve(HandleUserService);

    const professorUpdated = await handleUserService.update({
      id,
      name,
      isAdmin,
    });

    return response.status(201).json(professorUpdated);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleUserService = container.resolve(HandleUserService);

    await handleUserService.delete(id);

    return response
      .status(201)
      .json({ message: "Usuario removido com sucesso!" });
  }

  async authenticate(
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ): Promise<Response> {
    const { password, email } = request.body;

    const authenticateUserService = container.resolve(HandleUserService);

    const authInfo = await authenticateUserService.authenticate({
      email,
      password,
    });

    return response.json(authInfo);
  }
}

export { HandleUserController };

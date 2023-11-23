import { Request, Response } from "express";
import { container } from "tsyringe";

import { IRequestWithUser } from "../../../../config/types";
import { HandleRestricoesService } from "./HandleRestricoesService";

class HandleRestricoesController {
  async create(
    request: IRequestWithUser,
    response: Response
  ): Promise<Response> {
    const { body, user } = request;

    const handleRestricoesService = container.resolve(HandleRestricoesService);
    let createdRestricoes: any;

    if (Array.isArray(body)) {
      createdRestricoes = await handleRestricoesService.createMany(
        body.map(({ dia, letra }) => ({
          siape: user.siape,
          dia,
          letra,
        }))
      );
    } else {
      const { dia, letra } = body;
      createdRestricoes = await handleRestricoesService.create({
        siape: user.siape,
        dia,
        letra,
      });
    }

    return response.status(201).json(createdRestricoes);
  }

  async read(request: IRequestWithUser, response: Response): Promise<Response> {
    const { isAdmin, siape } = request.user;
    const handleRestricoesService = container.resolve(HandleRestricoesService);

    const listRestricoes = isAdmin
      ? await handleRestricoesService.read()
      : await handleRestricoesService.readBySiape(siape);

    return response.status(201).json(listRestricoes);
  }

  async readBySiape(request: Request, response: Response): Promise<Response> {
    const { siape } = request.params;

    const handleRestricoesService = container.resolve(HandleRestricoesService);

    const listRestricoes = await handleRestricoesService.readBySiape(siape);

    return response.status(201).json(listRestricoes);
  }

  async delete(
    request: IRequestWithUser,
    response: Response
  ): Promise<Response> {
    const { siape } = request.user;

    const handleRestricoesService = container.resolve(HandleRestricoesService);

    await handleRestricoesService.deleteBySiape(siape);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleRestricoesService = container.resolve(HandleRestricoesService);

    await handleRestricoesService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleRestricoesController };

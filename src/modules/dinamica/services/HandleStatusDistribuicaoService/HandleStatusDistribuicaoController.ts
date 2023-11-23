import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleStatusDistribuicaoService } from "./HandleStatusDistribuicaoService";

class HandleStatusDistribuicaoController {
  async create(request: Request, response: Response): Promise<Response> {
    const { id, descricao } = request.body;

    const handleStatusDistribuicaoService = container.resolve(
      HandleStatusDistribuicaoService
    );

    const status = await handleStatusDistribuicaoService.create({
      id,
      descricao,
    });

    return response.status(201).json(status);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleStatusDistribuicaoService = container.resolve(
      HandleStatusDistribuicaoService
    );

    const status = await handleStatusDistribuicaoService.read();

    return response.status(201).json(status);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { codigo, id, descricao } = request.body;

    const handleStatusDistribuicaoService = container.resolve(
      HandleStatusDistribuicaoService
    );

    const status = await handleStatusDistribuicaoService.update({
      codigo,
      id,
      descricao,
    });

    return response.status(201).json(status);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleStatusDistribuicaoService = container.resolve(
      HandleStatusDistribuicaoService
    );

    await handleStatusDistribuicaoService.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleStatusDistribuicaoService = container.resolve(
      HandleStatusDistribuicaoService
    );

    await handleStatusDistribuicaoService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleStatusDistribuicaoController };

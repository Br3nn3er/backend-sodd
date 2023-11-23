import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleSemanaService } from "./HandleSemanaService";

class HandleSemanaController {
  async create(request: Request, response: Response): Promise<Response> {
    const { dia, descricao } = request.body;

    const handleSemanaService = container.resolve(HandleSemanaService);

    const semana = await handleSemanaService.create({ dia, descricao });

    return response.status(201).json(semana);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleSemanaService = container.resolve(HandleSemanaService);

    const semanas = await handleSemanaService.read();

    return response.status(201).json(semanas);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { dia, descricao } = request.body;

    const handleSemanaService = container.resolve(HandleSemanaService);

    const semana = await handleSemanaService.update({ dia, descricao });

    return response.status(201).json(semana);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { dia } = request.params;
    const handleSemanaService = container.resolve(HandleSemanaService);

    await handleSemanaService.delete(dia);

    return response.status(201).json("Semana removida com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleSemanaService = container.resolve(HandleSemanaService);

    await handleSemanaService.import(file);

    return response.status(201).json("Arquivo importado com sucesso!");
  }
}

export { HandleSemanaController };

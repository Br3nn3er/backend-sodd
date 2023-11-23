import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandlePrioridadeService } from "./HandlePrioridadeService";

class HandlePrioridadeController {
  async create(request: Request, response: Response): Promise<Response> {
    const { prioridade, codigo_disc, siape } = request.body;

    const handlePrioridadeService = container.resolve(HandlePrioridadeService);

    const prioridades = await handlePrioridadeService.create({
      prioridade,
      codigo_disc,
      siape,
    });

    return response.status(201).json(prioridades);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handlePrioridadeService = container.resolve(HandlePrioridadeService);

    const listPrioridades = await handlePrioridadeService.read();

    return response.status(201).json(listPrioridades);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id, prioridade, codigo_disc, siape } = request.body;

    const handlePrioridadeService = container.resolve(HandlePrioridadeService);

    const prioridadeToUpdate = await handlePrioridadeService.update({
      id,
      prioridade,
      codigo_disc,
      siape,
    });

    return response.status(201).json(prioridadeToUpdate);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handlePrioridadeService = container.resolve(HandlePrioridadeService);

    await handlePrioridadeService.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handlePrioridadeService = container.resolve(HandlePrioridadeService);

    await handlePrioridadeService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandlePrioridadeController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandlePossibilidadesService } from "./HandlePossibilidadesService";

class HandlePossibilidadesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { descricao, num_cenario } = request.body;

    const handlePossibilidadeService = container.resolve(
      HandlePossibilidadesService
    );

    const possibilidade = await handlePossibilidadeService.create({
      descricao,
      num_cenario,
    });

    return response.status(201).json(possibilidade);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handlePossibilidadeService = container.resolve(
      HandlePossibilidadesService
    );

    const listPossibilidades = await handlePossibilidadeService.read();

    return response.status(201).json(listPossibilidades);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id, descricao, num_cenario } = request.body;

    const handlePossibilidadeService = container.resolve(
      HandlePossibilidadesService
    );

    const possibilidadeToUpdate = await handlePossibilidadeService.update({
      id,
      descricao,
      num_cenario,
    });

    return response.status(201).json(possibilidadeToUpdate);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handlePossibilidadeService = container.resolve(
      HandlePossibilidadesService
    );

    await handlePossibilidadeService.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handlePossibilidadeService = container.resolve(
      HandlePossibilidadesService
    );

    await handlePossibilidadeService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandlePossibilidadesController };

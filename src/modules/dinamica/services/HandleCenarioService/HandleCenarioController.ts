import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleCenarioService } from "./HandleCenarioService";

class HandleCenarioController {
  async create(request: Request, response: Response): Promise<Response> {
    const { descricao_cenario, ano, semestre } = request.body;

    const handleCenarioService = container.resolve(HandleCenarioService);

    const cenario = await handleCenarioService.create({
      descricao_cenario,
      ano,
      semestre,
    });

    return response.status(201).json(cenario);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleCenarioService = container.resolve(HandleCenarioService);

    const listCenarios = await handleCenarioService.read();

    return response.status(201).json(listCenarios);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { num_cenario, descricao_cenario, ano, semestre } = request.body;

    const handleCenarioService = container.resolve(HandleCenarioService);

    const cenarioToUpdate = await handleCenarioService.update({
      num_cenario,
      descricao_cenario,
      ano,
      semestre,
    });

    return response.status(201).json(cenarioToUpdate);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { num_cenario } = request.params;

    const handleCenarioService = container.resolve(HandleCenarioService);

    await handleCenarioService.delete(num_cenario);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleCenarioService = container.resolve(HandleCenarioService);

    await handleCenarioService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleCenarioController };

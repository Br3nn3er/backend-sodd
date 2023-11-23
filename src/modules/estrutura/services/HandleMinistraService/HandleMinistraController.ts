import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleMinistraService } from "./HandleMinistraService";

class HandleMinistraController {
  async create(request: Request, response: Response): Promise<Response> {
    const { siape, id_turma } = request.body;

    const handleMinistraService = container.resolve(HandleMinistraService);

    const ministra = await handleMinistraService.create({
      siape,
      id_turma,
    });

    return response.status(201).json(ministra);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleMinistraService = container.resolve(HandleMinistraService);

    const allMinistra = await handleMinistraService.read();

    return response.status(201).json(allMinistra);
  }

  async readByProfessorAndSemestre(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { semestre } = request.params;
    const { siapes = [] } = request.query;

    if (!siapes || !siapes?.length) {
      return response.status(201).json([]);
    }

    const handleMinistraService = container.resolve(HandleMinistraService);

    const allMinistra = await handleMinistraService.readByProfessorAndSemestre(
      siapes as string[],
      parseInt(semestre, 10)
    );

    return response.status(201).json(allMinistra);
  }

  async readByTurmaAndSemestre(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { semestre } = request.params;
    const { turmas = [] } = request.query;

    if (!turmas || !turmas?.length) {
      return response.status(201).json([]);
    }

    const handleMinistraService = container.resolve(HandleMinistraService);

    const allMinistra = await handleMinistraService.readByTurmaAndSemestre(
      (turmas as string[]).map((turma) => parseInt(turma, 10)),
      parseInt(semestre, 10)
    );

    return response.status(201).json(allMinistra);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { siape, id_turma } = request.body;

    const handleMinistraService = container.resolve(HandleMinistraService);

    await handleMinistraService.delete(siape, id_turma);

    return response.status(201).json("Relação removida com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleMinistraService = container.resolve(HandleMinistraService);

    await handleMinistraService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleMinistraController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleDistribuicoesPossibilidadeService } from "./HandleDistribuicoesPossibilidadeService";

class HandleDistribuicoesPossibilidadeController {
  async create(request: Request, response: Response): Promise<Response> {
    const { id_possibilidade, siape, id_turma } = request.body;

    const handleDistribuicoesPossibilidadeService = container.resolve(
      HandleDistribuicoesPossibilidadeService
    );

    const dist = await handleDistribuicoesPossibilidadeService.create({
      id_possibilidade,
      siape,
      id_turma,
    });

    return response.status(201).json(dist);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleDistribuicoesPossibilidadeService = container.resolve(
      HandleDistribuicoesPossibilidadeService
    );

    const listDistribuicoesPossibilidades =
      await handleDistribuicoesPossibilidadeService.read();

    return response.status(201).json(listDistribuicoesPossibilidades);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id_possibilidade, siape, id_turma } = request.body;

    const handleDistribuicoesPossibilidadeService = container.resolve(
      HandleDistribuicoesPossibilidadeService
    );

    await handleDistribuicoesPossibilidadeService.delete(
      id_possibilidade,
      siape,
      id_turma
    );

    return response.status(201).json("Registro deletado com sucesso!");
  }
}

export { HandleDistribuicoesPossibilidadeController };

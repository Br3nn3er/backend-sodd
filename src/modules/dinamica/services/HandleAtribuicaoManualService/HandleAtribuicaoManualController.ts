import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleAtribuicaoManualService } from "./HandleAtribuicaoManualService";

class HandleAtribuicaoManualController {
  async create(request: Request, response: Response): Promise<Response> {
    const { num_cenario, siape, id_turma } = request.body;

    const handleAtribuicaoManualService = container.resolve(
      HandleAtribuicaoManualService
    );

    const atribuicao = await handleAtribuicaoManualService.create({
      num_cenario,
      siape,
      id_turma,
    });

    return response.status(201).json(atribuicao);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleAtribuicaoManualService = container.resolve(
      HandleAtribuicaoManualService
    );

    const atribuicoes = await handleAtribuicaoManualService.read();

    return response.status(201).json(atribuicoes);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { num_cenario, id_turma } = request.body;

    const handleAtribuicaoManualService = container.resolve(
      HandleAtribuicaoManualService
    );

    await handleAtribuicaoManualService.delete(num_cenario, id_turma);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleAtribuicaoManualService = container.resolve(
      HandleAtribuicaoManualService
    );

    await handleAtribuicaoManualService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleAtribuicaoManualController };

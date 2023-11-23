import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleCenarioFilaTurmaService } from "./HandleCenarioFilaTurmaService";

class HandleCenarioFilaTurmaController {
  async create(request: Request, response: Response): Promise<Response> {
    const { num_cenario, id_turma, id_fila, status, prioridade, posicao } =
      request.body;

    const handleCenarioFilaTurmaRepository = container.resolve(
      HandleCenarioFilaTurmaService
    );

    const cenarioFila = await handleCenarioFilaTurmaRepository.create({
      num_cenario,
      id_turma,
      id_fila,
      status,
      prioridade,
      posicao,
    });

    return response.status(201).json(cenarioFila);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleCenarioFilaTurmaRepository = container.resolve(
      HandleCenarioFilaTurmaService
    );

    const cenarioFilas = await handleCenarioFilaTurmaRepository.read();

    return response.status(201).json(cenarioFilas);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { num_cenario, id_turma, id_fila, status, prioridade, posicao } =
      request.body;

    const handleCenarioFilaTurmaRepository = container.resolve(
      HandleCenarioFilaTurmaService
    );

    const cenarioFila = await handleCenarioFilaTurmaRepository.update({
      num_cenario,
      id_turma,
      id_fila,
      status,
      prioridade,
      posicao,
    });

    return response.status(201).json(cenarioFila);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { num_cenario, id_turma, id_fila } = request.body;

    const handleCenarioFilaTurmaRepository = container.resolve(
      HandleCenarioFilaTurmaService
    );

    await handleCenarioFilaTurmaRepository.delete(
      num_cenario,
      id_turma,
      id_fila
    );

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleCenarioFilaTurmaRepository = container.resolve(
      HandleCenarioFilaTurmaService
    );

    await handleCenarioFilaTurmaRepository.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleCenarioFilaTurmaController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleFilaTurmaService } from "./HandleFilaTurmaService";

class HandleFilaTurmaController {
  async create(request: Request, response: Response): Promise<Response> {
    const {
      siape,
      id_turma,
      codigo_disc,
      turma,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      status,
      ch,
      id,
      periodo_preferencial,
    } = request.body;

    const handleFilaTurmaRepository = container.resolve(HandleFilaTurmaService);

    const fila = await handleFilaTurmaRepository.create({
      siape,
      id_turma,
      codigo_disc,
      turma,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      status,
      ch,
      id,
      periodo_preferencial,
    });

    return response.status(201).json(fila);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleFilaTurmaRepository = container.resolve(HandleFilaTurmaService);

    const filas = await handleFilaTurmaRepository.read();

    return response.status(201).json(filas);
  }

  async readByProfessor(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { siape } = request.params;
    const handleFilaTurmaRepository = container.resolve(HandleFilaTurmaService);

    const filas = await handleFilaTurmaRepository.readByProfessor(siape);

    return response.status(200).json(filas);
  }

  async readByTurma(request: Request, response: Response): Promise<Response> {
    const { id_turma } = request.params;
    const handleFilaTurmaRepository = container.resolve(HandleFilaTurmaService);

    const filas = await handleFilaTurmaRepository.readByTurma(
      parseInt(id_turma)
    );

    return response.status(200).json(filas);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const {
      siape,
      id_turma,
      codigo_disc,
      turma,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      status,
      ch,
      id,
      periodo_preferencial,
    } = request.body;

    const handleFilaTurmaRepository = container.resolve(HandleFilaTurmaService);

    const fila = await handleFilaTurmaRepository.update({
      siape,
      id_turma,
      codigo_disc,
      turma,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      status,
      ch,
      id,
      periodo_preferencial,
    });

    return response.status(201).json(fila);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const handleFilaTurmaRepository = container.resolve(HandleFilaTurmaService);

    await handleFilaTurmaRepository.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }
}

export { HandleFilaTurmaController };

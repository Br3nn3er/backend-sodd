import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleFilaService } from "./HandleFilaService";

class HandleFilaController {
  async create(request: Request, response: Response): Promise<Response> {
    const {
      siape,
      codigo_disc,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      ano,
      semestre,
      status,
      periodo_preferencial,
    } = request.body;

    const handleFilaRepository = container.resolve(HandleFilaService);

    const fila = await handleFilaRepository.create({
      siape,
      codigo_disc,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      ano,
      semestre,
      status,
      periodo_preferencial,
    });

    return response.status(201).json(fila);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleFilaRepository = container.resolve(HandleFilaService);

    const filas = await handleFilaRepository.read();

    return response.status(201).json(filas);
  }

  async readByDiscEAnoESemestre(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { codigo, semestreId } = request.params;
    const handleFilaRepository = container.resolve(HandleFilaService);

    const filas = await handleFilaRepository.readByDisciplinaESemestre(
      codigo,
      parseInt(semestreId as string, 10)
    );

    return response.status(200).json(filas);
  }

  async readByProfessorESemestre(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { siape, semestreId } = request.params;
    const handleFilaRepository = container.resolve(HandleFilaService);

    const filas = await handleFilaRepository.readByProfessorESemestre(
      siape,
      parseInt(semestreId as string, 10)
    );

    return response.status(200).json(filas);
  }

  async readByProfessor(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { siape } = request.params;
    const handleFilaRepository = container.resolve(HandleFilaService);

    const filas = await handleFilaRepository.readByProfessor(siape);

    return response.status(200).json(filas);
  }

  async readByTurma(request: Request, response: Response): Promise<Response> {
    const { turma } = request.params;
    const handleFilaRepository = container.resolve(HandleFilaService);

    const filas = await handleFilaRepository.readByTurma(
      parseInt(turma as string, 10)
    );

    return response.status(200).json(filas);
  }

  async readBySemestreEProfessor(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { siape, ano, semestre } = request.params;
    const handleFilaRepository = container.resolve(HandleFilaService);

    const filas = await handleFilaRepository.readBySemestreEProfessor(
      siape,
      parseInt(ano as string, 10),
      parseInt(semestre as string, 10)
    );

    return response.status(200).json(filas);
  }
  async update(request: Request, response: Response): Promise<Response> {
    const {
      id,
      siape,
      codigo_disc,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      ano,
      semestre,
      status,
      periodo_preferencial,
    } = request.body;

    const handleFilaRepository = container.resolve(HandleFilaService);

    const fila = await handleFilaRepository.update({
      id,
      siape,
      codigo_disc,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      ano,
      semestre,
      status,
      periodo_preferencial,
    });

    return response.status(201).json(fila);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleFilaRepository = container.resolve(HandleFilaService);

    await handleFilaRepository.delete(parseInt(id, 10));

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleFilaRepository = container.resolve(HandleFilaService);

    await handleFilaRepository.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleFilaController };

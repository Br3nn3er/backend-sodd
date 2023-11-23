import { Request, Response } from "express";
import { container } from "tsyringe";

import { Disciplina } from "../../infra/typeorm/entities/Disciplina";
import { HandleDisciplinaService } from "./HandleDisciplinaService";

class HandleDisciplinaController {
  async create(request: Request, response: Response): Promise<Response> {
    const {
      codigo,
      nome,
      ch_teorica,
      ch_pratica,
      ch_total,
      curso,
      temfila,
      periodo,
      cod_antigo,
    } = request.body;

    const handleDisciplinaService = container.resolve(HandleDisciplinaService);

    const disciplina = await handleDisciplinaService.create({
      codigo,
      nome,
      ch_teorica,
      ch_pratica,
      ch_total,
      curso,
      temfila,
      periodo,
      cod_antigo,
    });

    return response.status(201).json(disciplina);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleDisciplinaService = container.resolve(HandleDisciplinaService);

    const disciplinas = await handleDisciplinaService.read();

    return response.status(200).json(disciplinas);
  }

  async readByCodigo(
    request: Request,
    response: Response
  ): Promise<Response<Disciplina>> {
    const { codigo } = request.params;
    const handleDisciplinaService = container.resolve(HandleDisciplinaService);

    const discipline = await handleDisciplinaService.readByCodigo(codigo);

    return response.status(200).json(discipline);
  }

  async readBySiapeEAnoESemestre(
    request: Request,
    response: Response
  ): Promise<Response<Disciplina>> {
    const { siape, ano, semestre } = request.params;
    const handleDisciplinaService = container.resolve(HandleDisciplinaService);

    const discipline = await handleDisciplinaService.readBySiapeEAnoESemestre(
      siape,
      parseInt(ano as string, 10),
      parseInt(semestre as string, 10)
    );

    return response.status(200).json(discipline);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const {
      codigo,
      nome,
      ch_teorica,
      ch_pratica,
      ch_total,
      curso,
      temfila,
      periodo,
    } = request.body;

    const handleDisciplinaService = container.resolve(HandleDisciplinaService);

    const disciplinaToUpdate = await handleDisciplinaService.update({
      codigo,
      nome,
      ch_teorica,
      ch_pratica,
      ch_total,
      curso,
      temfila,
      periodo,
    });

    return response.status(200).json(disciplinaToUpdate);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { codigo } = request.params;

    const handleDisciplinaService = container.resolve(HandleDisciplinaService);

    await handleDisciplinaService.delete(codigo);

    return response.status(200).json(`Disciplina removida com sucesso!`);
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleDisciplinaService = container.resolve(HandleDisciplinaService);

    await handleDisciplinaService.import(file);

    return response.status(200).json("Importação realizada com sucesso!");
  }
}

export { HandleDisciplinaController };

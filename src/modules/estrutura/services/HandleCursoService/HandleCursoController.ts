import { Request, Response } from "express";
import { container } from "tsyringe";

import { Curso } from "../../infra/typeorm/entities/Curso";
import { HandleCursoService } from "./HandleCursoService";

class HandleCursoController {
  async create(request: Request, response: Response): Promise<Response> {
    const {
      nome,
      codigo,
      unidade,
      campus,
      permitir_choque_periodo,
      permitir_choque_horario,
    } = request.body;

    const handleCursoService = container.resolve(HandleCursoService);

    const curso = await handleCursoService.create({
      nome,
      codigo,
      unidade,
      campus,
      permitir_choque_periodo,
      permitir_choque_horario,
    });

    return response.status(201).json(curso);
  }

  async read(request: Request, response: Response): Promise<Response<Curso[]>> {
    const handleCursoService = container.resolve(HandleCursoService);

    const cursos = await handleCursoService.read();

    return response.status(200).json(cursos);
  }

  async readByCodigo(
    request: Request,
    response: Response
  ): Promise<Response<Curso>> {
    const { codigo } = request.params;
    const handleCursoService = container.resolve(HandleCursoService);

    const course = await handleCursoService.readByCodigo(codigo);

    return response.status(200).json(course);
  }

  async update(request: Request, response: Response): Promise<Response<Curso>> {
    const {
      codigo,
      nome,
      unidade,
      campus,
      permitir_choque_periodo,
      permitir_choque_horario,
    } = request.body;

    const handleCursoService = container.resolve(HandleCursoService);

    const cursoToUpdate = await handleCursoService.update({
      codigo,
      nome,
      unidade,
      campus,
      permitir_choque_periodo,
      permitir_choque_horario,
    });

    return response.status(200).json(cursoToUpdate);
  }

  async delete(
    request: Request,
    response: Response
  ): Promise<Response<string>> {
    const { codigo } = request.params;

    const handleCursoService = container.resolve(HandleCursoService);

    await handleCursoService.delete(codigo);

    return response.status(200).json("Registro deletado com sucesso!");
  }

  async import(
    request: Request,
    response: Response
  ): Promise<Response<string>> {
    const { file } = request;

    const handleCursoService = container.resolve(HandleCursoService);

    await handleCursoService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleCursoController };

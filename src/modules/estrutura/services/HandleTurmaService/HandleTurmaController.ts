import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleTurmaService } from "./HandleTurmaService";

class HandleTurmaController {
  async create(request: Request, response: Response): Promise<Response> {
    const { codigo_disc, turma, ch, ano, semestre } = request.body;

    const handleTurmaService = container.resolve(HandleTurmaService);

    const createdTurma = await handleTurmaService.create({
      codigo_disc,
      turma,
      ch,
      ano,
      semestre,
    });

    return response.status(201).json(createdTurma);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleTurmaService = container.resolve(HandleTurmaService);
    const { semesterId } = request.query;

    const turmas = await handleTurmaService.read(
      semesterId ? parseInt(semesterId as string, 10) : undefined
    );

    return response.status(201).json(turmas);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id, codigo_disc, turma, ch, ano, semestre } = request.body;

    const handleTurmaService = container.resolve(HandleTurmaService);

    const turmaToUpdate = await handleTurmaService.update({
      id,
      codigo_disc,
      turma,
      ch,
      ano,
      semestre,
    });

    return response.status(201).json(turmaToUpdate);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleTurmaService = container.resolve(HandleTurmaService);

    await handleTurmaService.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleTurmaService = container.resolve(HandleTurmaService);

    await handleTurmaService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleTurmaController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleAuditoriaFilaNewService } from "./HandleAuditoriaFilaNewService";

class HandleAuditoriaFilaNewController {
  async create(request: Request, response: Response): Promise<Response> {
    const { id_turma, id_fila, prioridade_old, prioridade_new, stamp } =
      request.body;

    const handleAuditoriaFilaNewService = container.resolve(
      HandleAuditoriaFilaNewService
    );

    const auditoria = await handleAuditoriaFilaNewService.create({
      id_turma,
      id_fila,
      prioridade_old,
      prioridade_new,
      stamp,
    });

    return response.status(201).json(auditoria);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleAuditoriaFilaNewService = container.resolve(
      HandleAuditoriaFilaNewService
    );

    const auditorias = await handleAuditoriaFilaNewService.read();

    return response.status(201).json(auditorias);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id, id_turma, id_fila, prioridade_old, prioridade_new, stamp } =
      request.body;

    const handleAuditoriaFilaNewService = container.resolve(
      HandleAuditoriaFilaNewService
    );

    const auditoria = await handleAuditoriaFilaNewService.update({
      id,
      id_turma,
      id_fila,
      prioridade_old,
      prioridade_new,
      stamp,
    });

    return response.status(201).json(auditoria);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleAuditoriaFilaNewService = container.resolve(
      HandleAuditoriaFilaNewService
    );

    await handleAuditoriaFilaNewService.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleAuditoriaFilaNewService = container.resolve(
      HandleAuditoriaFilaNewService
    );

    await handleAuditoriaFilaNewService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleAuditoriaFilaNewController };

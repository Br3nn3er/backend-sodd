import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleAuditoriaPrioridadeService } from "./HandleAuditoriaPrioridadeService";

class HandleAuditoriaPrioridadeController {
  async create(request: Request, response: Response): Promise<Response> {
    const { siape, codigo_disc, prioridade_antiga, prioridade_nova, stamp } =
      request.body;

    const handleAuditoriaPrioridadeService = container.resolve(
      HandleAuditoriaPrioridadeService
    );

    const auditoria = await handleAuditoriaPrioridadeService.create({
      siape,
      codigo_disc,
      prioridade_antiga,
      prioridade_nova,
      stamp,
    });

    return response.status(201).json(auditoria);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleAuditoriaPrioridadeService = container.resolve(
      HandleAuditoriaPrioridadeService
    );

    const auditorias = await handleAuditoriaPrioridadeService.read();

    return response.status(201).json(auditorias);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const {
      id,
      siape,
      codigo_disc,
      prioridade_antiga,
      prioridade_nova,
      stamp,
    } = request.body;

    const handleAuditoriaPrioridadeService = container.resolve(
      HandleAuditoriaPrioridadeService
    );

    const auditoria = await handleAuditoriaPrioridadeService.update({
      id,
      siape,
      codigo_disc,
      prioridade_antiga,
      prioridade_nova,
      stamp,
    });

    return response.status(201).json(auditoria);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleAuditoriaPrioridadeService = container.resolve(
      HandleAuditoriaPrioridadeService
    );

    await handleAuditoriaPrioridadeService.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleAuditoriaPrioridadeService = container.resolve(
      HandleAuditoriaPrioridadeService
    );

    await handleAuditoriaPrioridadeService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleAuditoriaPrioridadeController };

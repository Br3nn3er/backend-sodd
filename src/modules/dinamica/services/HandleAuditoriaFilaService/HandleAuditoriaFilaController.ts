import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleAuditoriaFilaService } from "./HandleAuditoriaFilaService";

class HandleAuditoriaFilaController {
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
      comando,
      stamp,
    } = request.body;

    const handleAuditoriaFilaService = container.resolve(
      HandleAuditoriaFilaService
    );

    const auditoria = await handleAuditoriaFilaService.create({
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
      comando,
      stamp,
    });

    return response.status(201).json(auditoria);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleAuditoriaFilaService = container.resolve(
      HandleAuditoriaFilaService
    );

    const auditorias = await handleAuditoriaFilaService.read();

    return response.status(201).json(auditorias);
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
      comando,
      stamp,
    } = request.body;

    const handleAuditoriaFilaService = container.resolve(
      HandleAuditoriaFilaService
    );

    const auditoria = await handleAuditoriaFilaService.update({
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
      comando,
      stamp,
    });

    return response.status(201).json(auditoria);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleAuditoriaFilaService = container.resolve(
      HandleAuditoriaFilaService
    );

    await handleAuditoriaFilaService.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleAuditoriaFilaService = container.resolve(
      HandleAuditoriaFilaService
    );

    await handleAuditoriaFilaService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleAuditoriaFilaController };

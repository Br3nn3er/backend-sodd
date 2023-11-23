import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleEtapaService } from "./HandleEtapaService";

class HandleEtapaController {
  async create(request: Request, response: Response): Promise<Response> {
    const { codigo, ativo, descricao } = request.body;

    const handleEtapaRepository = container.resolve(HandleEtapaService);

    const etapa = await handleEtapaRepository.create({
      codigo,
      ativo,
      descricao,
    });

    return response.status(201).json(etapa);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleEtapaRepository = container.resolve(HandleEtapaService);

    const etapas = await handleEtapaRepository.read();

    return response.status(201).json(etapas);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id, codigo, ativo, descricao } = request.body;

    const handleEtapaRepository = container.resolve(HandleEtapaService);

    const etapa = await handleEtapaRepository.update({
      id,
      codigo,
      ativo,
      descricao,
    });

    return response.status(201).json(etapa);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleEtapaRepository = container.resolve(HandleEtapaService);

    await handleEtapaRepository.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleEtapaRepository = container.resolve(HandleEtapaService);

    await handleEtapaRepository.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleEtapaController };

import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleCargaDocenteService } from "./HandleCargaDocenteService";

class HandleCargaDocenteController {
  async create(request: Request, response: Response): Promise<Response> {
    const { siape, carga_atual, ano, semestre } = request.body;

    const handleCargaDocenteService = container.resolve(
      HandleCargaDocenteService
    );

    const carga = await handleCargaDocenteService.create({
      siape,
      carga_atual,
      ano,
      semestre,
    });

    return response.status(201).json(carga);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleCargaDocenteService = container.resolve(
      HandleCargaDocenteService
    );

    const cargas = await handleCargaDocenteService.read();

    return response.status(201).json(cargas);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { siape, carga_atual, ano, semestre } = request.body;

    const handleCargaDocenteService = container.resolve(
      HandleCargaDocenteService
    );

    const cargaToUpdate = await handleCargaDocenteService.update({
      siape,
      carga_atual,
      ano,
      semestre,
    });

    return response.status(201).json(cargaToUpdate);
  }

  async deleteBySiape(request: Request, response: Response): Promise<Response> {
    const { siape } = request.params;

    const handleCargaDocenteService = container.resolve(
      HandleCargaDocenteService
    );

    await handleCargaDocenteService.deleteBySiape(siape);

    return response.status(201).json("Carga removida com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleCargaDocenteService = container.resolve(
      HandleCargaDocenteService
    );

    await handleCargaDocenteService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleCargaDocenteController };

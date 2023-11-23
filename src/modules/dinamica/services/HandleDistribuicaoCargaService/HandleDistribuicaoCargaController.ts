import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleDistribuicaoCargaService } from "./HandleDistribuicaoCargaService";

class HandleDistribuicaoCargaController {
  async create(request: Request, response: Response): Promise<Response> {
    const { cenario, siape, regra, carga } = request.body;

    const handleDistribuicaoCargaService = container.resolve(
      HandleDistribuicaoCargaService
    );

    const dist = await handleDistribuicaoCargaService.create({
      cenario,
      siape,
      regra,
      carga,
    });

    return response.status(201).json(dist);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleDistribuicaoCargaService = container.resolve(
      HandleDistribuicaoCargaService
    );

    const listDistribuicaoCargas = await handleDistribuicaoCargaService.read();

    return response.status(201).json(listDistribuicaoCargas);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { cenario, siape, regra, carga } = request.body;

    const handleDistribuicaoCargaService = container.resolve(
      HandleDistribuicaoCargaService
    );

    const distToUpdate = await handleDistribuicaoCargaService.update({
      cenario,
      siape,
      regra,
      carga,
    });

    return response.status(201).json(distToUpdate);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { cenario, siape, regra } = request.body;

    const handleDistribuicaoCargaService = container.resolve(
      HandleDistribuicaoCargaService
    );

    await handleDistribuicaoCargaService.delete(cenario, siape, regra);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleDistribuicaoCargaService = container.resolve(
      HandleDistribuicaoCargaService
    );

    await handleDistribuicaoCargaService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleDistribuicaoCargaController };

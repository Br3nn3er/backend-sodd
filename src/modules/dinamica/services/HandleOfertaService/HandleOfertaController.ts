import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleOfertaService } from "./HandleOfertaService";

class HandleOfertaController {
  async create(request: Request, response: Response): Promise<Response> {
    const { dia, letra, id_turma } = request.body;

    const handleOfertaService = container.resolve(HandleOfertaService);

    const oferta = await handleOfertaService.create({ dia, letra, id_turma });

    return response.status(201).json(oferta);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleOfertaService = container.resolve(HandleOfertaService);

    const ofertas = await handleOfertaService.read();

    return response.status(201).json(ofertas);
  }

  async readByTurmaIdAndSemestreId(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { semestreId, turmaId } = request.params;
    const handleOfertaService = container.resolve(HandleOfertaService);

    const ofertas = await handleOfertaService.readByTurmaIdAndSemestreId(
      parseInt(turmaId, 10),
      parseInt(semestreId, 10)
    );

    return response.status(201).json(ofertas);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleOfertaService = container.resolve(HandleOfertaService);

    await handleOfertaService.delete(id);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleOfertaService = container.resolve(HandleOfertaService);

    await handleOfertaService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleOfertaController };

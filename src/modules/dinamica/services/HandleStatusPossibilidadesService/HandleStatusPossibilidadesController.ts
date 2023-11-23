import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleStatusPossibilidadesService } from "./HandleStatusPossibilidadesService";

class HandleStatusPossibilidadesController {
  async create(request: Request, response: Response): Promise<Response> {
    const { id_fila, id_possibilidade, status } = request.body;

    const handleStatusPossibilidadesService = container.resolve(
      HandleStatusPossibilidadesService
    );

    const statusToCreate = await handleStatusPossibilidadesService.create({
      id_fila,
      id_possibilidade,
      status,
    });

    return response.status(201).json(statusToCreate);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleStatusPossibilidadesService = container.resolve(
      HandleStatusPossibilidadesService
    );

    const status = await handleStatusPossibilidadesService.read();

    return response.status(201).json(status);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id_fila, id_possibilidade } = request.body;

    const handleStatusPossibilidadesService = container.resolve(
      HandleStatusPossibilidadesService
    );

    await handleStatusPossibilidadesService.delete(id_fila, id_possibilidade);

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleStatusPossibilidadesService = container.resolve(
      HandleStatusPossibilidadesService
    );

    await handleStatusPossibilidadesService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleStatusPossibilidadesController };

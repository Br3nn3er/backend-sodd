import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleHorarioService } from "./HandleHorarioService";

class HandleHorarioController {
  async create(request: Request, response: Response): Promise<Response> {
    const { letra, hora_inicio, hora_fim, turno } = request.body;

    const handleHorarioService = container.resolve(HandleHorarioService);

    const horario = await handleHorarioService.create({
      letra,
      hora_inicio,
      hora_fim,
      turno,
    });

    return response.status(201).json(horario);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleHorarioService = container.resolve(HandleHorarioService);

    const horarios = await handleHorarioService.read();

    return response.status(201).json(horarios);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { letra, hora_inicio, hora_fim, turno } = request.body;

    const handleHorarioService = container.resolve(HandleHorarioService);

    const horario = await handleHorarioService.update({
      letra,
      hora_inicio,
      hora_fim,
      turno,
    });

    return response.status(201).json(horario);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { letra } = request.params;

    const handleHorarioService = container.resolve(HandleHorarioService);

    await handleHorarioService.delete(letra);

    return response.status(201).json("Horário removido com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleHorarioService = container.resolve(HandleHorarioService);

    await handleHorarioService.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleHorarioController };

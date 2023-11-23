import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleSemestreService } from "./HandleSemestreService";

class HandleSemestreController {
  async create(request: Request, response: Response): Promise<Response> {
    const { ano, semestre, status } = request.body;

    const handleSemestreService = container.resolve(HandleSemestreService);

    const semestreCreated = await handleSemestreService.create({
      ano,
      semestre,
      status,
    });

    return response.status(201).json(semestreCreated);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleSemestreService = container.resolve(HandleSemestreService);

    const semestres = await handleSemestreService.read();

    return response.status(200).json(semestres);
  }

  async readById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const handleSemestreService = container.resolve(HandleSemestreService);

    const semestre = await handleSemestreService.readById(parseInt(id, 10));

    return response.status(200).json(semestre);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id, ano, semestre, status } = request.body;

    const handleSemestreService = container.resolve(HandleSemestreService);

    const semestreToUpdate = await handleSemestreService.update({
      id,
      ano,
      semestre,
      status,
    });

    return response.status(200).json(semestreToUpdate);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const handleSemestreService = container.resolve(HandleSemestreService);

    await handleSemestreService.delete(parseInt(id, 10));

    return response.status(200).json("Semestre removido com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleSemestreService = container.resolve(HandleSemestreService);

    await handleSemestreService.import(file);

    return response.status(201).json("Arquivo importado com sucesso!");
  }
}

export { HandleSemestreController };

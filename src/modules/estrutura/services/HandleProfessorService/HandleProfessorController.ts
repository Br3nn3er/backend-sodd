import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleProfessorService } from "./HandleProfessorService";

class HandleProfessorController {
  async create(request: Request, response: Response): Promise<Response> {
    const {
      siape,
      nome,
      data_ingresso,
      data_nasc,
      afastado,
      regime,
      carga_atual,
      locacao,
      cnome,
      data_saida,
      data_exoneracao,
      data_aposentadoria,
      status,
    } = request.body;

    const handleProfessorService = container.resolve(HandleProfessorService);

    const professor = await handleProfessorService.create({
      siape,
      nome,
      data_ingresso,
      data_nasc,
      afastado,
      regime,
      carga_atual,
      locacao,
      cnome,
      data_saida,
      data_exoneracao,
      data_aposentadoria,
      status,
    });

    return response.status(201).json(professor);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleProfessorService = container.resolve(HandleProfessorService);

    const professores = await handleProfessorService.read();

    return response.status(200).json(professores);
  }

  async readBySiape(request: Request, response: Response): Promise<Response> {
    const { siape } = request.params;
    const handleProfessorService = container.resolve(HandleProfessorService);

    const professores = await handleProfessorService.readBySiape(siape);

    return response.status(200).json(professores);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const {
      siape,
      nome,
      data_ingresso,
      data_nasc,
      afastado,
      regime,
      carga_atual,
      locacao,
      cnome,
      data_saida,
      data_exoneracao,
      data_aposentadoria,
      status,
    } = request.body;

    const handleProfessorService = container.resolve(HandleProfessorService);

    const professorToUpdate = await handleProfessorService.update({
      siape,
      nome,
      data_ingresso,
      data_nasc,
      afastado,
      regime,
      carga_atual,
      locacao,
      cnome,
      data_saida,
      data_exoneracao,
      data_aposentadoria,
      status,
    });

    return response.status(200).json(professorToUpdate);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { siape } = request.params;

    const handleProfessorService = container.resolve(HandleProfessorService);

    await handleProfessorService.delete(siape);

    return response.status(200).json("Professor removido com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleProfessorService = container.resolve(HandleProfessorService);

    await handleProfessorService.import(file);

    return response.status(201).send();
  }
}

export { HandleProfessorController };

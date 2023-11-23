import { Request, Response } from "express";
import { container } from "tsyringe";

import { IRequestWithUser } from "../../../../config/types";
import { HandleFilaTurmaNewService } from "./HandleFilaTurmaNewService";

class HandleFilaTurmaNewController {
  async create(request: Request, response: Response): Promise<Response> {
    const { id_turma, id_fila, prioridade } = request.body;

    const handleFilaTurmaNewRepository = container.resolve(
      HandleFilaTurmaNewService
    );

    const fila = await handleFilaTurmaNewRepository.create({
      id_turma,
      id_fila,
      prioridade,
    });

    return response.status(201).json(fila);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const handleFilaTurmaNewRepository = container.resolve(
      HandleFilaTurmaNewService
    );

    const filas = await handleFilaTurmaNewRepository.read();

    return response.status(201).json(filas);
  }

  async readByProfessorAndSemestreId(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { siape, semestreId } = request.params;
    const handleFilaTurmaNewRepository = container.resolve(
      HandleFilaTurmaNewService
    );

    const filas =
      await handleFilaTurmaNewRepository.readByProfessorAndSemestreId(
        siape,
        parseInt(semestreId, 10)
      );

    return response.status(200).json(filas);
  }

  async readFromLoggedUserBySemestreId(
    request: IRequestWithUser,
    response: Response
  ): Promise<Response> {
    const { semestreId } = request.params;
    const { isNotInQueue = "false" } = request.query;
    const handleFilaTurmaNewRepository = container.resolve(
      HandleFilaTurmaNewService
    );

    const filas =
      await handleFilaTurmaNewRepository.readByProfessorAndSemestreId(
        request.user.siape,
        parseInt(semestreId, 10),
        isNotInQueue === "true"
      );

    return response.status(200).json(filas);
  }

  async readByTurma(request: Request, response: Response): Promise<Response> {
    const { turmaID } = request.params;

    const handleFilaTurmaNewRepository = container.resolve(
      HandleFilaTurmaNewService
    );

    const filas = await handleFilaTurmaNewRepository.readByTurma(
      parseInt(turmaID, 10)
    );

    return response.status(201).json(filas);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id_turma, id_fila, prioridade } = request.body;

    const handleFilaTurmaNewRepository = container.resolve(
      HandleFilaTurmaNewService
    );

    const fila = await handleFilaTurmaNewRepository.update({
      id_turma,
      id_fila,
      prioridade,
    });

    return response.status(201).json(fila);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { id_turma, id_fila } = request.body;

    const handleFilaTurmaNewRepository = container.resolve(
      HandleFilaTurmaNewService
    );

    await handleFilaTurmaNewRepository.delete(
      parseInt(id_turma, 10),
      parseInt(id_fila, 10)
    );

    return response.status(201).json("Registro deletado com sucesso!");
  }

  async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const handleFilaTurmaNewRepository = container.resolve(
      HandleFilaTurmaNewService
    );

    await handleFilaTurmaNewRepository.import(file);

    return response.status(201).json("Importação realizada com sucesso!");
  }
}

export { HandleFilaTurmaNewController };

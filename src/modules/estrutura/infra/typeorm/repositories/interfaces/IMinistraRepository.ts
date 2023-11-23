import { ICreateMinistraDTO } from "../../../../dtos/ICreateMinistraDTO";
import { Ministra } from "../../entities/Ministra";

interface IMinistraRepository {
  listByTurmasAndSemestre(
    turmaIds: number[],
    ano: number,
    semestre: number
  ): Promise<Ministra[]>;
  create(data: ICreateMinistraDTO): Promise<Ministra>;
  listAllMinistra(): Promise<Ministra[]>;
  listMinistraByProfessorAndSemestre(
    siapes: string[],
    ano: number,
    semestre: number
  ): Promise<Ministra[]>;
  queryBySiapeAndIdTurma(siape: string, id_turma: string): Promise<Ministra>;
  deleteBySiapeAndIdTurma(siape: string, id_turma: string): Promise<void>;
}

export { IMinistraRepository };

import {
  ICreateFilaTurmaNewDTO,
  IPatchFilaTurmaNewDTO,
} from "../../../../dtos/ICreateFilaTurmaNewDTO";
import { FilaTurmaNew } from "../../entities/FilaTurmaNew";

interface IFilaTurmaNewRepository {
  create(data: ICreateFilaTurmaNewDTO): Promise<FilaTurmaNew>;
  listFilas(): Promise<FilaTurmaNew[]>;
  readByProfessorAndSemestre(
    siape: string,
    semestre: number,
    ano: number
  ): Promise<FilaTurmaNew[]>;
  readByProfessorAndSemestreExcludingProfessor(
    siape: string,
    semestre: number,
    ano: number
  ): Promise<FilaTurmaNew[]>;
  queryByTurmaEFila(id_turma: number, id_fila: number): Promise<FilaTurmaNew>;
  queryByTurma(id_turma: number): Promise<FilaTurmaNew[]>;
  updateByTurmaEFila(data: IPatchFilaTurmaNewDTO): Promise<FilaTurmaNew>;
  deleteByTurmaEFila(id_turma: number, id_fila: number): Promise<void>;
}

export { IFilaTurmaNewRepository };

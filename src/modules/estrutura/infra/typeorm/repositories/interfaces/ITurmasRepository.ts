import {
  ICreateTurmaDTO,
  IPatchTurmaDTO,
} from "../../../../dtos/ICreateUpdateTurmaDTO";
import { Turma } from "../../entities/Turma";

interface ITurmasRepository {
  createTurma(data: ICreateTurmaDTO): Promise<Turma>;
  listAllTurmas(): Promise<Turma[]>;
  queryById(id: string): Promise<Turma>;
  queryByAnoESemestre(ano: number, semestre: number): Promise<Turma[]>;
  queryByCodigo(codigo_disc: string): Promise<Turma>;
  queryByCodigoTurmaAnoSemestre(
    codigo: string,
    turma: string,
    ano: number,
    semestre: number
  ): Promise<Turma>;
  updateById(data: IPatchTurmaDTO): Promise<Turma>;
  deleteById(id: string): Promise<void>;
}

export { ITurmasRepository };

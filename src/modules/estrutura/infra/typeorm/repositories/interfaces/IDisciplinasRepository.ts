import {
  ICreateDisciplinaDTO,
  IPatchDisciplinaDTO,
} from "../../../../dtos/ICreateUpdateDisciplinaDTO";
import { Disciplina } from "../../entities/Disciplina";

interface IDisciplinasRepository {
  createDisciplina(data: ICreateDisciplinaDTO): Promise<Disciplina>;
  listAllDisciplinas(): Promise<Disciplina[]>;
  queryByCodigo(codigo: string): Promise<Disciplina>;
  updateByCodigo(data: IPatchDisciplinaDTO): Promise<Disciplina>;
  deleteByCodigo(codigo: string): Promise<void>;
  queryBySiapeEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Disciplina[]>;
}

export { IDisciplinasRepository };

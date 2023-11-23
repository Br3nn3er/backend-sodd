import {
  ICreateFilaTurmaDTO,
  IPatchFilaTurmaDTO,
} from "../../../../dtos/ICreateFilaTurmaDTO";
import { FilaTurma } from "../../entities/FilaTurma";

interface IFilaTurmaRepository {
  create(data: ICreateFilaTurmaDTO): Promise<FilaTurma>;
  listFilas(): Promise<FilaTurma[]>;
  queryById(id: number): Promise<FilaTurma>;
  queryBySiape(siape: string): Promise<FilaTurma[]>;
  queryByTurma(id: number): Promise<FilaTurma[]>;
  updateById(data: IPatchFilaTurmaDTO): Promise<FilaTurma>;
  deleteById(id: number): Promise<void>;
}

export { IFilaTurmaRepository };

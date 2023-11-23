import {
  ICreateCursosDTO,
  IPatchCursosDTO,
} from "../../../../dtos/ICreateUpdateCursosDTO";
import { Curso } from "../../entities/Curso";

interface ICursosRepository {
  createCurso(data: ICreateCursosDTO): Promise<Curso>;
  listAllCursos(): Promise<Curso[]>;
  queryByCodigo(codigo: string): Promise<Curso>;
  update(data: IPatchCursosDTO): Promise<Curso>;
  deleteByCodigo(codigo: string): Promise<void>;
}

export { ICursosRepository };

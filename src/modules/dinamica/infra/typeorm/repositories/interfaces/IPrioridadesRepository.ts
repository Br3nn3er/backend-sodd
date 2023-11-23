import {
  ICreatePrioridadesDTO,
  IPatchPrioridadesDTO,
} from "../../../../dtos/ICreatePrioridadesDTO";
import { Prioridades } from "../../entities/Prioridades";

interface IPrioridadesRepository {
  create(data: ICreatePrioridadesDTO): Promise<Prioridades>;
  listAllPrioridades(): Promise<Prioridades[]>;
  queryById(id: string): Promise<Prioridades>;
  queryBySiapeECodigo(siape: string, codigo_disc: string): Promise<Prioridades>;
  updateById(data: IPatchPrioridadesDTO): Promise<Prioridades>;
  deleteById(id: string): Promise<void>;
}

export { IPrioridadesRepository };

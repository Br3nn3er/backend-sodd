import {
  ICreateEtapaDTO,
  IPatchEtapaDTO,
} from "../../../../dtos/ICreateEtapaDTO";
import { Etapa } from "../../entities/Etapa";

interface IEtapaRepository {
  create(data: ICreateEtapaDTO): Promise<Etapa>;
  listEtapas(): Promise<Etapa[]>;
  queryById(id: string): Promise<Etapa>;
  queryByCodigo(codigo: string): Promise<Etapa>;
  updateById(data: IPatchEtapaDTO): Promise<Etapa>;
  deleteById(id: string): Promise<void>;
}

export { IEtapaRepository };

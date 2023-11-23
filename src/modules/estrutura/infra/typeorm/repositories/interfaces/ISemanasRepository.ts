import {
  ICreateSemanaDTO,
  IPatchSemanaDTO,
} from "../../../../dtos/ICreateUpdateSemanaDTO";
import { Semana } from "../../entities/Semana";

interface ISemanasRepository {
  createSemana(data: ICreateSemanaDTO): Promise<Semana>;
  queryByDia(dia: string): Promise<Semana>;
  listAllSemanas(): Promise<Semana[]>;
  update(data: IPatchSemanaDTO): Promise<Semana>;
  deleteByDia(dia: string): Promise<void>;
}

export { ISemanasRepository };

import { ICreateStatusPossibilidadesDTO } from "../../../../dtos/ICreateStatusPossibilidadesDTO";
import { StatusPossibilidades } from "../../entities/StatusPossibilidades";

interface IStatusPossibilidadesRepository {
  create(data: ICreateStatusPossibilidadesDTO): Promise<StatusPossibilidades>;
  listStatusPossibilidades(): Promise<StatusPossibilidades[]>;
  queryByFilaEPossibilidade(
    id_fila: number,
    id_possibilidade: number
  ): Promise<StatusPossibilidades>;
  deleteByFilaEPossibilidade(
    id_fila: number,
    id_possibilidade: number
  ): Promise<void>;
}

export { IStatusPossibilidadesRepository };

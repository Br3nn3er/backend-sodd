import {
  ICreatePossibilidadeDTO,
  IPatchPossibilidadeDTO,
} from "../../../../dtos/ICreatePossibilidadeDTO";
import { Possibilidades } from "../../entities/Possibilidades";

interface IPossibilidadesRepository {
  create(data: ICreatePossibilidadeDTO): Promise<Possibilidades>;
  listPossibilidades(): Promise<Possibilidades[]>;
  queryById(id: string): Promise<Possibilidades>;
  queryByNumCenario(num_cenario: number): Promise<Possibilidades>;
  updateById(data: IPatchPossibilidadeDTO): Promise<Possibilidades>;
  deleteById(id: string): Promise<void>;
}

export { IPossibilidadesRepository };

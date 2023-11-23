import {
  ICreateCenarioDTO,
  IPatchCenarioDTO,
} from "../../../../dtos/ICreateCenarioDTO";
import { Cenario } from "../../entities/Cenario";

interface ICenarioRepository {
  create(data: ICreateCenarioDTO): Promise<Cenario>;
  listCenarios(): Promise<Cenario[]>;
  queryByNumCenario(num_cenario: string): Promise<Cenario>;
  queryByAnoESemestre(ano: number, semestre: number): Promise<Cenario>;
  updateByNumCenario(data: IPatchCenarioDTO): Promise<Cenario>;
  deleteByNumCenario(num_cenario: string): Promise<void>;
}

export { ICenarioRepository };

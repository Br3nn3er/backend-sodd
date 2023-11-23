import {
  ICreateCenarioFilaTurmaDTO,
  IPatchCenarioFilaTurmaDTO,
} from "../../../../dtos/ICreateCenarioFilaTurmaDTO";
import { CenarioFilaTurma } from "../../entities/CenarioFilaTurma";

interface ICenarioFilaTurmaRepository {
  create(data: ICreateCenarioFilaTurmaDTO): Promise<CenarioFilaTurma>;
  listCenarios(): Promise<CenarioFilaTurma[]>;
  queryByCenarioETurmaEFila(
    num_cenario: number,
    id_turma: number,
    id_fila: number
  ): Promise<CenarioFilaTurma>;
  updateByCenarioETurmaEFila(
    data: IPatchCenarioFilaTurmaDTO
  ): Promise<CenarioFilaTurma>;
  deleteByCenarioETurmaEFila(
    num_cenario: number,
    id_turma: number,
    id_fila: number
  ): Promise<void>;
}

export { ICenarioFilaTurmaRepository };

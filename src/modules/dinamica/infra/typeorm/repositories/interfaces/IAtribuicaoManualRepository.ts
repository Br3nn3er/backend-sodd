import { ICreateAtribuicaoManualDTO } from "../../../../dtos/ICreateAtribuicaoManualDTO";
import { AtribuicaoManual } from "../../entities/AtribuicaoManual";

interface IAtribuicaoManualRepository {
  create(data: ICreateAtribuicaoManualDTO): Promise<AtribuicaoManual>;
  listAllAtribuicoes(): Promise<AtribuicaoManual[]>;
  queryByCenarioETurma(
    num_cenario: number,
    id_turma: number
  ): Promise<AtribuicaoManual>;
  deleteByCenarioETurma(num_cenario: number, id_turma: number): Promise<void>;
}

export { IAtribuicaoManualRepository };

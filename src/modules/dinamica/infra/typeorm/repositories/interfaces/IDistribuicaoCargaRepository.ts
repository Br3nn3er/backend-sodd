import {
  ICreateDistribuicaoCargaDTO,
  IPatchDistribuicaoCargaDTO,
} from "../../../../dtos/ICreateDistribuicaoCargaDTO";
import { DistribuicaoCarga } from "../../entities/DistribuicaoCarga";

interface IDistribuicaoCargaRepository {
  create(data: ICreateDistribuicaoCargaDTO): Promise<DistribuicaoCarga>;
  listDistribuicoes(): Promise<DistribuicaoCarga[]>;
  queryByCenarioESiapeERegra(
    cenario: number,
    siape: string,
    regra: string
  ): Promise<DistribuicaoCarga>;
  update(data: IPatchDistribuicaoCargaDTO): Promise<DistribuicaoCarga>;
  deleteByCenarioESiapeERegra(
    cenario: number,
    siape: string,
    regra: string
  ): Promise<void>;
}

export { IDistribuicaoCargaRepository };

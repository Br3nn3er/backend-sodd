import {
  ICreateStatusDistribuicaoDTO,
  IPatchStatusDistribuicaoDTO,
} from "../../../../dtos/ICreateStatusDistribuicaoDTO";
import { StatusDistribuicao } from "../../entities/StatusDistribuicao";

interface IStatusDistribuicaoRepository {
  create(data: ICreateStatusDistribuicaoDTO): Promise<StatusDistribuicao>;
  listAllStatus(): Promise<StatusDistribuicao[]>;
  queryById(id: number): Promise<StatusDistribuicao>;
  queryByCodigo(codigo: string): Promise<StatusDistribuicao>;
  updateByCodigo(
    data: IPatchStatusDistribuicaoDTO
  ): Promise<StatusDistribuicao>;
  deleteByCodigo(codigo: string): Promise<void>;
}

export { IStatusDistribuicaoRepository };

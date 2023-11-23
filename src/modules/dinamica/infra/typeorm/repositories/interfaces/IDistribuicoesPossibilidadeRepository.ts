import { ICreateDistribuicoesPossibilidadeDTO } from "../../../../dtos/ICreateDistribuicoesPossibilidadeDTO";
import { DistribuicoesPossibilidade } from "../../entities/DistribuicoesPossibilidade";

interface IDistribuicoesPossibilidadeRepository {
  create(
    data: ICreateDistribuicoesPossibilidadeDTO
  ): Promise<DistribuicoesPossibilidade>;
  listDistribuicoes(): Promise<DistribuicoesPossibilidade[]>;
  queryByPossibilidadeESiapeETurma(
    id_possibilidade: number,
    siape: string,
    id_turma: number
  ): Promise<DistribuicoesPossibilidade>;
  deleteByPossibilidadeESiapeETurma(
    id_possibilidade: number,
    siape: string,
    id_turma: number
  ): Promise<void>;
}

export { IDistribuicoesPossibilidadeRepository };

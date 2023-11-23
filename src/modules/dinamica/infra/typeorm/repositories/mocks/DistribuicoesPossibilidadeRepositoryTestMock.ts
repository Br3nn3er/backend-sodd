import {ICreateDistribuicoesPossibilidadeDTO} from "../../../../dtos/ICreateDistribuicoesPossibilidadeDTO";
import {DistribuicoesPossibilidade} from "../../entities/DistribuicoesPossibilidade";
import {IDistribuicoesPossibilidadeRepository} from "../interfaces/IDistribuicoesPossibilidadeRepository";

class DistribuicoesPossibilidadeRepositoryTestMock
  implements IDistribuicoesPossibilidadeRepository
{
  private listDist: DistribuicoesPossibilidade[] = [];

  async create({
    id_possibilidade,
    siape,
    id_turma,
  }: ICreateDistribuicoesPossibilidadeDTO): Promise<DistribuicoesPossibilidade> {
    const dist = new DistribuicoesPossibilidade();

    Object.assign(dist, { id_possibilidade, siape, id_turma });

    this.listDist.push(dist);

    return dist;
  }

  async listDistribuicoes(): Promise<DistribuicoesPossibilidade[]> {
    return this.listDist;
  }

  async queryByPossibilidadeESiapeETurma(
    id_possibilidade: number,
    siape: string,
    id_turma: number
  ): Promise<DistribuicoesPossibilidade> {
    return this.listDist.find(
      (distFounded) =>
        distFounded.id_possibilidade === id_possibilidade &&
        distFounded.siape === siape &&
        distFounded.id_turma === id_turma
    );
  }

  async deleteByPossibilidadeESiapeETurma(
    id_possibilidade: number,
    siape: string,
    id_turma: number
  ): Promise<void> {
    const distIndex = this.listDist.findIndex(
      (distFounded) =>
        distFounded.id_possibilidade === id_possibilidade &&
        distFounded.siape === siape &&
        distFounded.id_turma === id_turma
    );

    if (distIndex > -1) {
      this.listDist.splice(distIndex, 1);
    }
  }
}

export { DistribuicoesPossibilidadeRepositoryTestMock };

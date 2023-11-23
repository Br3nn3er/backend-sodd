import {inject, injectable} from "tsyringe";

import {AppError} from "../../../../shared/errors/AppError";
import {DistribuicoesPossibilidade} from "../../infra/typeorm/entities/DistribuicoesPossibilidade";
import {
  IDistribuicoesPossibilidadeRepository
} from "../../infra/typeorm/repositories/interfaces/IDistribuicoesPossibilidadeRepository";

interface IHandleDistribuicoesPossibilidade {
  id_possibilidade: number;
  siape: string;
  id_turma: number;
}

@injectable()
class HandleDistribuicoesPossibilidadeService {
  constructor(
    @inject("DistribuicoesPossibilidadeRepository")
    private distRepository: IDistribuicoesPossibilidadeRepository
  ) {}

  async create({
    id_possibilidade,
    siape,
    id_turma,
  }: IHandleDistribuicoesPossibilidade): Promise<DistribuicoesPossibilidade> {
    const existentDist =
      await this.distRepository.queryByPossibilidadeESiapeETurma(
        id_possibilidade,
        siape,
        id_turma
      );

    if (existentDist) {
      throw new AppError("Distribuicao já cadastrada!");
    }

    return await this.distRepository.create({
      id_possibilidade,
      siape,
      id_turma,
    });
  }

  async read(): Promise<DistribuicoesPossibilidade[]> {
    const dists = await this.distRepository.listDistribuicoes();

    dists.forEach((dist) => {
      // eslint-disable-next-line no-param-reassign
      dist.siape = dist.siape ? dist.siape.trim() : null;
    });

    return dists;
  }

  async delete(
    id_possibilidade: number,
    siape: string,
    id_turma: number
  ): Promise<void> {
    await this.distRepository.deleteByPossibilidadeESiapeETurma(
      id_possibilidade,
      siape,
      id_turma
    );
  }
}

export { HandleDistribuicoesPossibilidadeService };

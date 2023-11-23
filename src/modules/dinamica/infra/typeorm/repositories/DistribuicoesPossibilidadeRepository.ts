import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { ICreateDistribuicoesPossibilidadeDTO } from "../../../dtos/ICreateDistribuicoesPossibilidadeDTO";
import { DistribuicoesPossibilidade } from "../entities/DistribuicoesPossibilidade";
import { IDistribuicoesPossibilidadeRepository } from "./interfaces/IDistribuicoesPossibilidadeRepository";

class DistribuicoesPossibilidadeRepository
  implements IDistribuicoesPossibilidadeRepository
{
  private repository: Repository<DistribuicoesPossibilidade>;

  constructor() {
    this.repository = dataSource.getRepository(DistribuicoesPossibilidade);
  }

  async create({
    id_possibilidade,
    siape,
    id_turma,
  }: ICreateDistribuicoesPossibilidadeDTO): Promise<DistribuicoesPossibilidade> {
    const dist = this.repository.create({ id_possibilidade, siape, id_turma });

    await this.repository.save(dist);

    return dist;
  }

  async listDistribuicoes(): Promise<DistribuicoesPossibilidade[]> {
    return this.repository
      .createQueryBuilder("distribuicoes_possibilidade")
      .orderBy("siape", "ASC")
      .getMany();
  }

  async queryByPossibilidadeESiapeETurma(
    id_possibilidade: number,
    siape: string,
    id_turma: number
  ): Promise<DistribuicoesPossibilidade> {
    return this.repository.findOne({
      where: { id_possibilidade, siape, id_turma },
    });
  }

  async deleteByPossibilidadeESiapeETurma(
    id_possibilidade: number,
    siape: string,
    id_turma: number
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(DistribuicoesPossibilidade)
      .where("id_possibilidade = :id_possibilidade", { id_possibilidade })
      .andWhere("siape = :siape", { siape })
      .andWhere("id_turma = :id_turma", { id_turma })
      .execute();
  }
}

export { DistribuicoesPossibilidadeRepository };

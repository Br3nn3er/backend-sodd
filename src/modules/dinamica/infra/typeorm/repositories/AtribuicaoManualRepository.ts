import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { ICreateAtribuicaoManualDTO } from "../../../dtos/ICreateAtribuicaoManualDTO";
import { AtribuicaoManual } from "../entities/AtribuicaoManual";
import { IAtribuicaoManualRepository } from "./interfaces/IAtribuicaoManualRepository";

class AtribuicaoManualRepository implements IAtribuicaoManualRepository {
  private repository: Repository<AtribuicaoManual>;

  constructor() {
    this.repository = dataSource.getRepository(AtribuicaoManual);
  }

  async create({
    num_cenario,
    siape,
    id_turma,
  }: ICreateAtribuicaoManualDTO): Promise<AtribuicaoManual> {
    const atribuicao = this.repository.create({ num_cenario, siape, id_turma });

    await this.repository.save(atribuicao);

    return atribuicao;
  }

  async listAllAtribuicoes(): Promise<AtribuicaoManual[]> {
    return this.repository
      .createQueryBuilder("atribuicao_manual")
      .orderBy("num_cenario", "ASC")
      .getMany();
  }

  async queryByCenarioETurma(
    num_cenario: number,
    id_turma: number
  ): Promise<AtribuicaoManual> {
    return this.repository.findOne({
      where: { num_cenario, id_turma },
    });
  }

  async deleteByCenarioETurma(
    num_cenario: number,
    id_turma: number
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(AtribuicaoManual)
      .where("num_cenario = :num_cenario", { num_cenario })
      .andWhere("id_turma = :id_turma", { id_turma })
      .execute();
  }
}

export { AtribuicaoManualRepository };

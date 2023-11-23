import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { ICreateRestricoesDTO } from "../../../dtos/ICreateRestricoesDTO";
import { Restricoes } from "../entities/Restricoes";
import { IRestricoesRepository } from "./interfaces/IRestricoesRepository";

class RestricoesRepository implements IRestricoesRepository {
  private repository: Repository<Restricoes>;

  constructor() {
    this.repository = dataSource.getRepository(Restricoes);
  }

  async create({
    siape,
    dia,
    letra,
  }: ICreateRestricoesDTO): Promise<Restricoes> {
    const restricoes = this.repository.create({ siape, dia, letra });

    await this.repository.save(restricoes);

    return restricoes;
  }

  createMany(data: ICreateRestricoesDTO[]): Promise<Restricoes[]> {
    const restricoes = this.repository.create(data);
    return this.repository.save(restricoes);
  }

  async deleteBySiape(siape: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .where("siape = :siape", { siape })
      .delete()
      .execute();
  }

  async listRestricoes(): Promise<Restricoes[]> {
    return this.repository
      .createQueryBuilder("restricoes")
      .orderBy("siape", "ASC")
      .getMany();
  }

  async queryBySiapeEDiaELetra(
    siape: string,
    dia: string,
    letra: string
  ): Promise<Restricoes> {
    return this.repository.findOne({
      where: { siape, dia, letra },
    });
  }

  async queryBySiape(siape: string): Promise<Restricoes[]> {
    return this.repository.find({
      where: { siape },
    });
  }
  async deleteBySiapeEDiaELetra(
    siape: string,
    dia: string,
    letra: string
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(Restricoes)
      .where("siape = :siape", { siape })
      .andWhere("dia = :dia", { dia })
      .andWhere("letra = :letra", { letra })
      .execute();
  }
}

export { RestricoesRepository };

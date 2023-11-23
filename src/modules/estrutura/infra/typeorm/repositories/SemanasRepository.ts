import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateSemanaDTO,
  IPatchSemanaDTO,
} from "../../../dtos/ICreateUpdateSemanaDTO";
import { Semana } from "../entities/Semana";
import { ISemanasRepository } from "./interfaces/ISemanasRepository";

class SemanasRepository implements ISemanasRepository {
  private repository: Repository<Semana>;

  constructor() {
    this.repository = dataSource.getRepository(Semana);
  }

  async createSemana({ dia, descricao }: ICreateSemanaDTO): Promise<Semana> {
    const semana = this.repository.create({ dia, descricao });

    await this.repository.save(semana);

    return semana;
  }

  async listAllSemanas(): Promise<Semana[]> {
    return this.repository
      .createQueryBuilder("semana")
      .orderBy("dia", "ASC")
      .getMany();
  }

  async queryByDia(dia: string): Promise<Semana> {
    return this.repository.findOneBy({ dia });
  }

  async update({ dia, descricao }: IPatchSemanaDTO): Promise<Semana> {
    const semana = await this.repository.findOneBy({ dia });

    semana.descricao = descricao || semana.descricao;

    await this.repository.save(semana);

    return semana;
  }

  async deleteByDia(dia: string): Promise<void> {
    await this.repository.delete(dia);
  }
}

export { SemanasRepository };

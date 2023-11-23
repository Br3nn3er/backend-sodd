import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreatePossibilidadeDTO,
  IPatchPossibilidadeDTO,
} from "../../../dtos/ICreatePossibilidadeDTO";
import { Possibilidades } from "../entities/Possibilidades";
import { IPossibilidadesRepository } from "./interfaces/IPossibilidadesRepository";

class PossibilidadesRepository implements IPossibilidadesRepository {
  private repository: Repository<Possibilidades>;

  constructor() {
    this.repository = dataSource.getRepository(Possibilidades);
  }

  async create({
    descricao,
    num_cenario,
  }: ICreatePossibilidadeDTO): Promise<Possibilidades> {
    const possibilidades = this.repository.create({ descricao, num_cenario });

    await this.repository.save(possibilidades);

    return possibilidades;
  }

  async listPossibilidades(): Promise<Possibilidades[]> {
    return this.repository
      .createQueryBuilder("possibilidades")
      .orderBy("id", "ASC")
      .getMany();
  }

  async queryById(id: string): Promise<Possibilidades> {
    return this.repository.findOneBy({ id });
  }

  async queryByNumCenario(num_cenario: number): Promise<Possibilidades> {
    return this.repository.findOne({
      where: { num_cenario },
    });
  }

  async updateById({
    id,
    descricao,
    num_cenario,
  }: IPatchPossibilidadeDTO): Promise<Possibilidades> {
    const possibilidade = await this.repository.findOneBy({ id });

    possibilidade.descricao = descricao || possibilidade.descricao;
    possibilidade.num_cenario = num_cenario || possibilidade.num_cenario;

    await this.repository.save(possibilidade);

    return possibilidade;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { PossibilidadesRepository };

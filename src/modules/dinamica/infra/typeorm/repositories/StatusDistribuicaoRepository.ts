import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateStatusDistribuicaoDTO,
  IPatchStatusDistribuicaoDTO,
} from "../../../dtos/ICreateStatusDistribuicaoDTO";
import { StatusDistribuicao } from "../entities/StatusDistribuicao";
import { IStatusDistribuicaoRepository } from "./interfaces/IStatusDistribuicaoRepository";

class StatusDistribuicaoRepository implements IStatusDistribuicaoRepository {
  private repository: Repository<StatusDistribuicao>;

  constructor() {
    this.repository = dataSource.getRepository(StatusDistribuicao);
  }

  async create({
    id,
    descricao,
  }: ICreateStatusDistribuicaoDTO): Promise<StatusDistribuicao> {
    const status = this.repository.create({ id, descricao });

    await this.repository.save(status);

    return status;
  }

  async listAllStatus(): Promise<StatusDistribuicao[]> {
    return this.repository
      .createQueryBuilder("status_distribuicao")
      .orderBy("id", "ASC")
      .getMany();
  }

  async queryById(id: number): Promise<StatusDistribuicao> {
    return this.repository.findOne({ where: { id } });
  }

  async queryByCodigo(codigo: string): Promise<StatusDistribuicao> {
    return this.repository.findOneBy({ codigo });
  }

  async updateByCodigo({
    codigo,
    id,
    descricao,
  }: IPatchStatusDistribuicaoDTO): Promise<StatusDistribuicao> {
    const statusFounded = await this.repository.findOneBy({ codigo });

    statusFounded.descricao = descricao || statusFounded.descricao;
    statusFounded.id = id || statusFounded.id;

    await this.repository.save(statusFounded);

    return statusFounded;
  }

  async deleteByCodigo(codigo: string): Promise<void> {
    await this.repository.delete(codigo);
  }
}

export { StatusDistribuicaoRepository };

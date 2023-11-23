import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreatePrioridadesDTO,
  IPatchPrioridadesDTO,
} from "../../../dtos/ICreatePrioridadesDTO";
import { Prioridades } from "../entities/Prioridades";
import { IPrioridadesRepository } from "./interfaces/IPrioridadesRepository";

class PrioridadesRepository implements IPrioridadesRepository {
  private prioridadesRepository: Repository<Prioridades>;

  constructor() {
    this.prioridadesRepository = dataSource.getRepository(Prioridades);
  }

  async create({
    prioridade,
    codigo_disc,
    siape,
  }: ICreatePrioridadesDTO): Promise<Prioridades> {
    const prioridades = this.prioridadesRepository.create({
      prioridade,
      codigo_disc,
      siape,
    });

    await this.prioridadesRepository.save(prioridades);

    return prioridades;
  }

  async listAllPrioridades(): Promise<Prioridades[]> {
    return this.prioridadesRepository
      .createQueryBuilder("prioridades")
      .orderBy("siape", "ASC")
      .getMany();
  }

  async queryById(id: string): Promise<Prioridades> {
    return this.prioridadesRepository.findOneBy({ id });
  }

  async queryBySiapeECodigo(
    siape: string,
    codigo_disc: string
  ): Promise<Prioridades> {
    return this.prioridadesRepository.findOne({
      where: { siape, codigo_disc },
    });
  }

  async updateById({
    id,
    prioridade,
    codigo_disc,
    siape,
  }: IPatchPrioridadesDTO): Promise<Prioridades> {
    const prioridadeToUpdate = await this.prioridadesRepository.findOneBy({
      id,
    });

    prioridadeToUpdate.prioridade = prioridade || prioridadeToUpdate.prioridade;
    prioridadeToUpdate.codigo_disc =
      codigo_disc || prioridadeToUpdate.codigo_disc;
    prioridadeToUpdate.siape = siape || prioridadeToUpdate.siape;

    await this.prioridadesRepository.save(prioridadeToUpdate);

    return prioridadeToUpdate;
  }

  async deleteById(id: string): Promise<void> {
    await this.prioridadesRepository.delete(id);
  }
}

export { PrioridadesRepository };

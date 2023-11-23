import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateAuditoriaPrioridadeDTO,
  IPatchAuditoriaPrioridadeDTO,
} from "../../../dtos/ICreateAuditoriaPrioridadeDTO";
import { AuditoriaPrioridade } from "../entities/AuditoriaPrioridade";
import { IAuditoriaPrioridadeRepository } from "./interfaces/IAuditoriaPrioridadeRepository";

class AuditoriaPrioridadeRepository implements IAuditoriaPrioridadeRepository {
  private repository: Repository<AuditoriaPrioridade>;

  constructor() {
    this.repository = dataSource.getRepository(AuditoriaPrioridade);
  }

  async create({
    siape,
    codigo_disc,
    prioridade_antiga,
    prioridade_nova,
    stamp,
  }: ICreateAuditoriaPrioridadeDTO): Promise<AuditoriaPrioridade> {
    const auditoriaPrioridade = this.repository.create({
      siape,
      codigo_disc,
      prioridade_antiga,
      prioridade_nova,
      stamp,
    });

    await this.repository.save(auditoriaPrioridade);

    return auditoriaPrioridade;
  }

  async listAllAuditorias(): Promise<AuditoriaPrioridade[]> {
    return this.repository
      .createQueryBuilder("auditoria_prioridade")
      .orderBy("siape", "ASC")
      .getMany();
  }

  async queryById(id: string): Promise<AuditoriaPrioridade> {
    return this.repository.findOneBy({ id });
  }

  async queryBySiape(siape: string): Promise<AuditoriaPrioridade> {
    return this.repository.findOneBy({ siape });
  }

  async update({
    id,
    siape,
    codigo_disc,
    prioridade_antiga,
    prioridade_nova,
    stamp,
  }: IPatchAuditoriaPrioridadeDTO): Promise<AuditoriaPrioridade> {
    const auditoria = await this.repository.findOneBy({ id });

    auditoria.siape = siape || auditoria.siape;
    auditoria.codigo_disc = codigo_disc || auditoria.codigo_disc;
    auditoria.prioridade_antiga =
      prioridade_antiga || auditoria.prioridade_antiga;
    auditoria.prioridade_nova = prioridade_nova || auditoria.prioridade_nova;
    auditoria.stamp = stamp || auditoria.stamp;

    await this.repository.save(auditoria);

    return auditoria;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { AuditoriaPrioridadeRepository };

import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateAuditoriaFilaDTO,
  IPatchAuditoriaFilaDTO,
} from "../../../dtos/ICreateAuditoriaFilaDTO";
import { AuditoriaFila } from "../entities/AuditoriaFila";
import { IAuditoriaFilaRepository } from "./interfaces/IAuditoriaFilaRepository";

class AuditoriaFilaRepository implements IAuditoriaFilaRepository {
  private repository: Repository<AuditoriaFila>;

  constructor() {
    this.repository = dataSource.getRepository(AuditoriaFila);
  }

  async create({
    siape,
    codigo_disc,
    pos,
    prioridade,
    qte_ministrada,
    qte_maximo,
    ano,
    semestre,
    status,
    periodo_preferencial,
    comando,
    stamp,
  }: ICreateAuditoriaFilaDTO): Promise<AuditoriaFila> {
    const auditoria = this.repository.create({
      siape,
      codigo_disc,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      ano,
      semestre,
      status,
      periodo_preferencial,
      comando,
      stamp,
    });

    await this.repository.save(auditoria);

    return auditoria;
  }

  async listAllAuditorias(): Promise<AuditoriaFila[]> {
    return this.repository
      .createQueryBuilder("auditoria_fila")
      .orderBy("siape", "ASC")
      .getMany();
  }

  async queryById(id: string): Promise<AuditoriaFila> {
    return this.repository.findOneBy({ id });
  }

  async queryBySiape(siape: string): Promise<AuditoriaFila> {
    return this.repository.findOneBy({ siape });
  }

  async updateById({
    id,
    siape,
    codigo_disc,
    pos,
    prioridade,
    qte_ministrada,
    qte_maximo,
    ano,
    semestre,
    status,
    periodo_preferencial,
    comando,
    stamp,
  }: IPatchAuditoriaFilaDTO): Promise<AuditoriaFila> {
    const auditoria = await this.repository.findOneBy({ id });

    auditoria.siape = siape || auditoria.siape;
    auditoria.codigo_disc = codigo_disc || auditoria.codigo_disc;
    auditoria.pos = pos || auditoria.pos;
    auditoria.prioridade = prioridade || auditoria.prioridade;
    auditoria.qte_ministrada = qte_ministrada || auditoria.qte_ministrada;
    auditoria.qte_maximo = qte_maximo || auditoria.qte_maximo;
    auditoria.ano = ano || auditoria.ano;
    auditoria.semestre = semestre || auditoria.semestre;
    auditoria.status = status || auditoria.status;

    auditoria.periodo_preferencial =
      periodo_preferencial === null || periodo_preferencial === undefined
        ? auditoria.periodo_preferencial
        : periodo_preferencial;

    auditoria.comando = comando || auditoria.comando;
    auditoria.stamp = stamp || auditoria.stamp;

    await this.repository.save(auditoria);

    return auditoria;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { AuditoriaFilaRepository };

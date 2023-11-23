import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { Disciplina } from "../../../../estrutura/infra/typeorm/entities/Disciplina";
import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";
import { Turma } from "../../../../estrutura/infra/typeorm/entities/Turma";
import { ICreateFilaDTO, IPatchFilaDTO } from "../../../dtos/ICreateFilaDTO";
import { Fila } from "../entities/Fila";
import { FilaTurmaNew } from "../entities/FilaTurmaNew";
import { IFilaRepository } from "./interfaces/IFilaRepository";

class FilaRepository implements IFilaRepository {
  private repository: Repository<Fila>;

  constructor() {
    this.repository = dataSource.getRepository(Fila);
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
  }: ICreateFilaDTO): Promise<Fila> {
    const fila = this.repository.create({
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
    });

    await this.repository.save(fila);

    return fila;
  }

  async listFilas(): Promise<Fila[]> {
    return this.repository
      .createQueryBuilder("fila")
      .orderBy("id", "ASC")
      .getMany();
  }

  async queryById(id: number): Promise<Fila> {
    return this.repository.findOneBy({ id });
  }

  async queryByDiscEPosEAnoESemestre(
    codigo_disc: string,
    pos: number,
    ano: number,
    semestre: number
  ): Promise<Fila> {
    return this.repository.findOne({
      where: { codigo_disc, pos, ano, semestre },
    });
  }

  async queryByDiscEAnoESemestre(
    codigo_disc: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]> {
    return this.repository.find({
      relations: ["professor"],
      where: { codigo_disc, ano, semestre },
      order: { pos: "ASC" },
    });
  }

  async queryBySIAPEEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]> {
    return this.repository.find({
      relations: ["professor", "disciplina", "disciplina.curso_disciplinas"],
      where: { siape, ano, semestre },
      order: { pos: "ASC" },
    });
  }

  async queryBySiape(siape: string): Promise<Fila[]> {
    return this.repository.find({
      relations: ["fila_turma_new"],
      where: { siape },
      order: { pos: "ASC" },
    });
  }

  async queryBySiapeEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]> {
    return dataSource
      .getRepository(Fila)
      .createQueryBuilder("fl")
      .select("dp.codigo", "codigo_disciplina")
      .addSelect("dp.nome", "nome_disciplina")
      .addSelect("tm.turma", "turma")
      .addSelect("fl.pos", "posicao")
      .addSelect("fl.prioridade", "prioridade")
      .addSelect("fl.qte_ministrada", "qte_ministrada")
      .addSelect("fl.qte_maximo", "qte_maximo")
      .leftJoin(FilaTurmaNew, "ftn", "ftn.id_fila = fl.id")
      .leftJoin(Turma, "tm", "tm.id = ftn.id_turma")
      .leftJoin(Disciplina, "dp", "fl.codigo_disc = dp.codigo")
      .where("fl.siape = :siape", { siape })
      .andWhere("tm.ano = :ano", { ano })
      .andWhere("tm.semestre = :semestre", { semestre })
      .orderBy("fl.prioridade", "DESC")
      .getRawMany();
  }

  async queryByTurma(turma: number): Promise<Fila[]> {
    return dataSource
      .getRepository(Fila)
      .createQueryBuilder("fl")
      .select("pf.nome", "nome_professor")
      .addSelect("fl.pos", "posicao")
      .addSelect("fl.prioridade", "prioridade")
      .addSelect("fl.qte_ministrada", "qte_ministrada")
      .addSelect("fl.qte_maximo", "qte_maximo")
      .leftJoin(FilaTurmaNew, "ftn", "ftn.id_fila = fl.id")
      .leftJoin(Turma, "tm", "tm.id = ftn.id_turma")
      .leftJoin(Professor, "pf", "pf.siape = fl.siape")
      .where("ftn.id_turma = :turma", { turma })
      .orderBy("fl.prioridade", "DESC")
      .getRawMany();
  }

  async queryBySiapeEDiscEAnoESemestre(
    siape: string,
    codigo_disc: string,
    ano: number,
    semestre: number
  ): Promise<Fila> {
    return this.repository.findOne({
      where: { siape, codigo_disc, ano, semestre },
    });
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
  }: IPatchFilaDTO): Promise<Fila> {
    const filaToUpdate = await this.repository.findOneBy({ id });

    filaToUpdate.siape = siape || filaToUpdate.siape;
    filaToUpdate.codigo_disc = codigo_disc || filaToUpdate.codigo_disc;
    filaToUpdate.pos = pos || filaToUpdate.pos;
    filaToUpdate.prioridade = prioridade || filaToUpdate.prioridade;
    filaToUpdate.qte_ministrada = qte_ministrada || filaToUpdate.qte_ministrada;
    filaToUpdate.qte_maximo = qte_maximo || filaToUpdate.qte_maximo;
    filaToUpdate.ano = ano || filaToUpdate.ano;
    filaToUpdate.semestre = semestre || filaToUpdate.semestre;
    filaToUpdate.status = status || filaToUpdate.status;
    filaToUpdate.periodo_preferencial =
      periodo_preferencial === null || periodo_preferencial === undefined
        ? filaToUpdate.periodo_preferencial
        : periodo_preferencial;

    await this.repository.save(filaToUpdate);

    return filaToUpdate;
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

export { FilaRepository };

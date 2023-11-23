import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { Fila } from "../../../../dinamica/infra/typeorm/entities/Fila";
import { FilaTurmaNew } from "../../../../dinamica/infra/typeorm/entities/FilaTurmaNew";
import {
  ICreateDisciplinaDTO,
  IPatchDisciplinaDTO,
} from "../../../dtos/ICreateUpdateDisciplinaDTO";
import { Disciplina } from "../entities/Disciplina";
import { Turma } from "../entities/Turma";
import { IDisciplinasRepository } from "./interfaces/IDisciplinasRepository";

class DisciplinasRepository implements IDisciplinasRepository {
  private repository: Repository<Disciplina>;

  constructor() {
    this.repository = dataSource.getRepository(Disciplina);
  }

  async createDisciplina({
    codigo,
    nome,
    ch_teorica,
    ch_pratica,
    ch_total,
    curso,
    temfila,
    periodo,
    cod_antigo,
  }: ICreateDisciplinaDTO): Promise<Disciplina> {
    const disciplina = this.repository.create({
      codigo,
      nome,
      ch_teorica,
      ch_pratica,
      ch_total,
      curso,
      temfila,
      periodo,
      cod_antigo,
    });

    await this.repository.save(disciplina);

    return disciplina;
  }

  async listAllDisciplinas(): Promise<Disciplina[]> {
    return this.repository
      .createQueryBuilder("disciplina")
      .orderBy("codigo", "ASC")
      .getMany();
  }

  async queryByCodigo(codigo: string): Promise<Disciplina> {
    return this.repository.findOneBy({ codigo });
  }

  async queryBySiapeEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Disciplina[]> {
    return dataSource
      .getRepository(Disciplina)
      .createQueryBuilder("dp")
      .select([
        "dp.codigo AS codigo_disciplina",
        "dp.nome AS nome_disciplina",
        "tm.turma AS turma",
        "dp.curso AS codigo_curso",
        "fl.siape AS siape",
        "ftn.prioridade AS prioridade",
        "fl.pos AS posicao",
        "fl.qte_ministrada AS qte_ministrada",
        "ftn.id_turma AS id_turma",
      ])
      .leftJoin(Turma, "tm", "dp.codigo = tm.codigo_disc")
      .leftJoin(FilaTurmaNew, "ftn", "tm.id = ftn.id_turma")
      .leftJoin(Fila, "fl", "fl.id = ftn.id_fila")
      .where("fl.siape = :siape", { siape })
      .andWhere("tm.ano = :ano", { ano })
      .andWhere("tm.semestre = :semestre", { semestre })
      .orderBy("codigo", "ASC")
      .getRawMany();
  }

  async updateByCodigo({
    codigo,
    nome,
    ch_teorica,
    ch_pratica,
    ch_total,
    curso,
    temfila,
    periodo,
  }: IPatchDisciplinaDTO): Promise<Disciplina> {
    const disciplinaToUpdate = await this.repository.findOneBy({
      codigo,
    });

    disciplinaToUpdate.nome = nome || disciplinaToUpdate.nome;
    disciplinaToUpdate.ch_teorica = ch_teorica || disciplinaToUpdate.ch_teorica;
    disciplinaToUpdate.ch_pratica = ch_pratica || disciplinaToUpdate.ch_pratica;
    disciplinaToUpdate.ch_total = ch_total || disciplinaToUpdate.ch_total;
    disciplinaToUpdate.curso = curso || disciplinaToUpdate.curso;
    disciplinaToUpdate.temfila =
      temfila === undefined || temfila === null
        ? disciplinaToUpdate.temfila
        : temfila;
    disciplinaToUpdate.periodo = periodo || disciplinaToUpdate.periodo;

    await this.repository.save(disciplinaToUpdate);

    return disciplinaToUpdate;
  }

  async deleteByCodigo(codigo: string): Promise<void> {
    await this.repository.delete(codigo);
  }
}

export { DisciplinasRepository };

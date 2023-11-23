import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateCenarioFilaTurmaDTO,
  IPatchCenarioFilaTurmaDTO,
} from "../../../dtos/ICreateCenarioFilaTurmaDTO";
import { CenarioFilaTurma } from "../entities/CenarioFilaTurma";
import { ICenarioFilaTurmaRepository } from "./interfaces/ICenarioFilaTurmaRepository";

class CenarioFilaTurmaRepository implements ICenarioFilaTurmaRepository {
  private repository: Repository<CenarioFilaTurma>;

  constructor() {
    this.repository = dataSource.getRepository(CenarioFilaTurma);
  }

  async create({
    num_cenario,
    id_turma,
    id_fila,
    status,
    prioridade,
    posicao,
  }: ICreateCenarioFilaTurmaDTO): Promise<CenarioFilaTurma> {
    const cenarioFila = this.repository.create({
      num_cenario,
      id_turma,
      id_fila,
      status,
      prioridade,
      posicao,
    });

    await this.repository.save(cenarioFila);

    return cenarioFila;
  }

  async listCenarios(): Promise<CenarioFilaTurma[]> {
    return this.repository
      .createQueryBuilder("cenario_fila_turma")
      .orderBy("num_cenario")
      .getMany();
  }

  async queryByCenarioETurmaEFila(
    num_cenario: number,
    id_turma: number,
    id_fila: number
  ): Promise<CenarioFilaTurma> {
    return this.repository.findOne({
      where: { num_cenario, id_turma, id_fila },
    });
  }

  async updateByCenarioETurmaEFila({
    num_cenario,
    id_turma,
    id_fila,
    status,
    prioridade,
    posicao,
  }: IPatchCenarioFilaTurmaDTO): Promise<CenarioFilaTurma> {
    const cenarioFilaToUpdate = await this.repository.findOne({
      where: { num_cenario, id_turma, id_fila },
    });

    cenarioFilaToUpdate.status = status || cenarioFilaToUpdate.status;
    cenarioFilaToUpdate.prioridade =
      prioridade || cenarioFilaToUpdate.prioridade;
    cenarioFilaToUpdate.posicao = posicao || cenarioFilaToUpdate.posicao;

    await this.repository.save(cenarioFilaToUpdate);

    return cenarioFilaToUpdate;
  }

  async deleteByCenarioETurmaEFila(
    num_cenario: number,
    id_turma: number,
    id_fila: number
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(CenarioFilaTurma)
      .where("num_cenario = :num_cenario", { num_cenario })
      .andWhere("id_turma = :id_turma", { id_turma })
      .andWhere("id_fila = :id_fila", { id_fila })
      .execute();
  }
}

export { CenarioFilaTurmaRepository };

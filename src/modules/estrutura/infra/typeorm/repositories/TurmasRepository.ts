import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateTurmaDTO,
  IPatchTurmaDTO,
} from "../../../dtos/ICreateUpdateTurmaDTO";
import { Turma } from "../entities/Turma";
import { ITurmasRepository } from "./interfaces/ITurmasRepository";

class TurmasRepository implements ITurmasRepository {
  private repository: Repository<Turma>;

  constructor() {
    this.repository = dataSource.getRepository(Turma);
  }

  async createTurma({
    codigo_disc,
    turma,
    ch,
    ano,
    semestre,
  }: ICreateTurmaDTO): Promise<Turma> {
    const turmaToCreate = this.repository.create({
      codigo_disc,
      turma,
      ch,
      ano,
      semestre,
    });

    await this.repository.save(turmaToCreate);

    return turmaToCreate;
  }

  async listAllTurmas(): Promise<Turma[]> {
    return this.repository
      .createQueryBuilder("turma")
      .orderBy("codigo_disc", "ASC")
      .getMany();
  }

  async queryByAnoESemestre(year: number, semester: number): Promise<Turma[]> {
    return this.repository
      .createQueryBuilder("turma")
      .innerJoinAndSelect("turma.disciplina", "disciplina")
      .where("ano = :year AND semestre = :semester", { semester, year })
      .orderBy("codigo_disc", "ASC")
      .getMany();
  }

  async queryById(id: string): Promise<Turma> {
    return this.repository.findOneBy({ id });
  }

  async queryByCodigo(codigo_disc: string): Promise<Turma> {
    return this.repository.findOneBy({ codigo_disc });
  }

  async queryByCodigoTurmaAnoSemestre(
    codigo: string,
    turma: string,
    ano: number,
    semestre: number
  ): Promise<Turma> {
    return this.repository.findOne({
      where: { codigo_disc: codigo, turma, ano, semestre },
    });
  }

  async updateById({
    id,
    codigo_disc,
    turma,
    ch,
    ano,
    semestre,
  }: IPatchTurmaDTO): Promise<Turma> {
    const turmaToUpdate = await this.repository.findOneBy({ id });

    turmaToUpdate.codigo_disc = codigo_disc || turmaToUpdate.codigo_disc;
    turmaToUpdate.turma = turma || turmaToUpdate.turma;
    turmaToUpdate.ch = ch || turmaToUpdate.ch;
    turmaToUpdate.ano = ano || turmaToUpdate.ano;
    turmaToUpdate.semestre = semestre || turmaToUpdate.semestre;

    await this.repository.save(turmaToUpdate);

    return turmaToUpdate;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { TurmasRepository };

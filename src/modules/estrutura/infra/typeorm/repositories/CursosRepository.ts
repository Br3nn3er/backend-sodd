import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateCursosDTO,
  IPatchCursosDTO,
} from "../../../dtos/ICreateUpdateCursosDTO";
import { Curso } from "../entities/Curso";
import { ICursosRepository } from "./interfaces/ICursosRepository";

class CursosRepository implements ICursosRepository {
  private repository: Repository<Curso>;

  constructor() {
    this.repository = dataSource.getRepository(Curso);
  }

  async queryByCodigo(codigo: string): Promise<Curso> {
    return this.repository.findOneBy({ codigo });
  }

  async createCurso({
    codigo,
    nome,
    unidade,
    campus,
    permitir_choque_periodo,
    permitir_choque_horario,
  }: ICreateCursosDTO): Promise<Curso> {
    const curso = this.repository.create({
      codigo,
      nome,
      unidade,
      campus,
      permitir_choque_periodo,
      permitir_choque_horario,
    });

    await this.repository.save(curso);

    return curso;
  }

  async listAllCursos(): Promise<Curso[]> {
    return this.repository
      .createQueryBuilder("curso")
      .orderBy("codigo", "ASC")
      .getMany();
  }

  async deleteByCodigo(codigo: string): Promise<void> {
    await this.repository.delete(codigo);
  }

  async update({
    codigo,
    nome,
    unidade,
    campus,
    permitir_choque_periodo,
    permitir_choque_horario,
  }: IPatchCursosDTO): Promise<Curso> {
    const cursoToUpdate = await this.repository.findOneBy({ codigo });

    cursoToUpdate.nome = nome || cursoToUpdate.nome;
    cursoToUpdate.unidade = unidade || cursoToUpdate.unidade;
    cursoToUpdate.campus = campus || cursoToUpdate.campus;
    cursoToUpdate.permitir_choque_periodo =
      permitir_choque_periodo === null || permitir_choque_periodo === undefined
        ? cursoToUpdate.permitir_choque_periodo
        : permitir_choque_periodo;
    cursoToUpdate.permitir_choque_horario =
      permitir_choque_horario === null || permitir_choque_horario === undefined
        ? cursoToUpdate.permitir_choque_horario
        : permitir_choque_horario;

    await this.repository.save(cursoToUpdate);

    return cursoToUpdate;
  }
}

export { CursosRepository };

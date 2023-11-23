import {
  ICreateCursosDTO,
  IPatchCursosDTO,
} from "../../../../dtos/ICreateUpdateCursosDTO";
import { Curso } from "../../entities/Curso";
import { ICursosRepository } from "../interfaces/ICursosRepository";

class CursosRepositoryTestMock implements ICursosRepository {
  cursos: Curso[] = [];

  async queryByCodigo(codigo: string): Promise<Curso> {
    return this.cursos.find((curso) => curso.codigo === codigo);
  }

  async createCurso({
    nome,
    codigo,
    unidade,
    campus,
    permitir_choque_periodo,
    permitir_choque_horario,
  }: ICreateCursosDTO): Promise<Curso> {
    const curso = new Curso();

    Object.assign(curso, {
      nome,
      codigo,
      unidade,
      campus,
      permitir_choque_periodo,
      permitir_choque_horario,
    });

    this.cursos.push(curso);

    return curso;
  }

  async listAllCursos(): Promise<Curso[]> {
    return this.cursos;
  }

  async deleteByCodigo(codigo: string): Promise<void> {
    const cursoIndex = this.cursos.findIndex(
      (curso) => curso.codigo === codigo
    );

    if (cursoIndex > -1) {
      this.cursos.splice(cursoIndex, 1);
    }
  }

  async update({
    codigo,
    nome,
    unidade,
    campus,
    permitir_choque_periodo,
    permitir_choque_horario,
  }: IPatchCursosDTO): Promise<Curso> {
    const cursoToUpdate = this.cursos.find((curso) => curso.codigo === codigo);

    Object.assign(cursoToUpdate, {
      nome: nome || cursoToUpdate.nome,
      unidade: unidade || cursoToUpdate.unidade,
      campus: campus || cursoToUpdate.campus,
      permitir_choque_periodo:
        permitir_choque_periodo === null ||
        permitir_choque_periodo === undefined
          ? cursoToUpdate.permitir_choque_periodo
          : permitir_choque_periodo,
      permitir_choque_horario:
        permitir_choque_horario === null ||
        permitir_choque_horario === undefined
          ? cursoToUpdate.permitir_choque_horario
          : permitir_choque_horario,
    });

    this.cursos.push(cursoToUpdate);

    return cursoToUpdate;
  }
}

export { CursosRepositoryTestMock };

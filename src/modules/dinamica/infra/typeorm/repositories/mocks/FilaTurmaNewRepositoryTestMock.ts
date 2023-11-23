import {ICreateFilaTurmaNewDTO, IPatchFilaTurmaNewDTO,} from "../../../../dtos/ICreateFilaTurmaNewDTO";
import {FilaTurmaNew} from "../../entities/FilaTurmaNew";
import {IFilaTurmaNewRepository} from "../interfaces/IFilaTurmaNewRepository";

class FilaTurmaNewRepositoryTestMock implements IFilaTurmaNewRepository {
  private listFilasTurma: FilaTurmaNew[] = [];

  async create({
    id_turma,
    id_fila,
    prioridade,
  }: ICreateFilaTurmaNewDTO): Promise<FilaTurmaNew> {
    const fila = new FilaTurmaNew();

    Object.assign(fila, { id_turma, id_fila, prioridade });

    this.listFilasTurma.push(fila);

    return fila;
  }

  async listFilas(): Promise<FilaTurmaNew[]> {
    return this.listFilasTurma;
  }

  async queryByTurmaEFila(
    id_turma: number,
    id_fila: number
  ): Promise<FilaTurmaNew> {
    return this.listFilasTurma.find(
      (fila) => fila.id_turma === id_turma && fila.id_fila === id_fila
    );
  }

  async queryByTurma(id_turma: number): Promise<FilaTurmaNew[]> {
    return this.listFilasTurma.filter((fila) => fila.id_turma === id_turma);
  }

  async updateByTurmaEFila({
    id_turma,
    id_fila,
    prioridade,
  }: IPatchFilaTurmaNewDTO): Promise<FilaTurmaNew> {
    const filaFounded = this.listFilasTurma.find(
      (fila) => fila.id_turma === id_turma && fila.id_fila === id_fila
    );

    Object.assign(filaFounded, {
      prioridade: prioridade || filaFounded.prioridade,
    });

    this.listFilasTurma.push(filaFounded);

    return filaFounded;
  }

  async deleteByTurmaEFila(id_turma: number, id_fila: number): Promise<void> {
    const filaIndex = this.listFilasTurma.findIndex(
      (fila) => fila.id_turma === id_turma && fila.id_fila === id_fila
    );

    if (filaIndex > -1) {
      this.listFilasTurma.splice(filaIndex, 1);
    }
  }

  async readByProfessorAndSemestre(
    siape: string,
    semestre: number,
    ano: number
  ): Promise<FilaTurmaNew[]> {
    return this.listFilasTurma.filter(
      (fila) =>
        fila.fila.siape === siape &&
        fila.fila.semestre === semestre &&
        fila.fila.ano === ano
    );
  }

  async readByProfessorAndSemestreExcludingProfessor(
    siape: string,
    semestre: number,
    ano: number
  ): Promise<FilaTurmaNew[]> {
    return this.listFilasTurma.filter(
      (fila) =>
        fila.fila.siape !== siape &&
        fila.fila.semestre === semestre &&
        fila.fila.ano === ano
    );
  }
}

export { FilaTurmaNewRepositoryTestMock };

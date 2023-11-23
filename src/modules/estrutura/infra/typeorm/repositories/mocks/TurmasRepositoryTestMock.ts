import {ICreateTurmaDTO, IPatchTurmaDTO,} from "../../../../dtos/ICreateUpdateTurmaDTO";
import {Turma} from "../../entities/Turma";
import {ITurmasRepository} from "../interfaces/ITurmasRepository";

class TurmasRepositoryTestMock implements ITurmasRepository {
  private turmas: Turma[] = [];
  private count = 0;

  async createTurma({
    codigo_disc,
    turma,
    ch,
    ano,
    semestre,
  }: ICreateTurmaDTO): Promise<Turma> {
    const turmaToCreate = new Turma();

    this.count += 1;
    Object.assign(turmaToCreate, {
      id: this.count,
      codigo_disc,
      turma,
      ch,
      ano,
      semestre,
    });

    this.turmas.push(turmaToCreate);

    return turmaToCreate;
  }

  async listAllTurmas(): Promise<Turma[]> {
    return this.turmas;
  }

  async queryById(id: string): Promise<Turma> {
    return this.turmas.find((turmaToSearch) => turmaToSearch.id === id);
  }

  async queryByCodigo(codigo_disc: string): Promise<Turma> {
    return this.turmas.find(
      (turmaToSearch) => turmaToSearch.codigo_disc === codigo_disc
    );
  }

  async queryByCodigoTurmaAnoSemestre(
    codigo: string,
    turma: string,
    ano: number,
    semestre: number
  ): Promise<Turma> {
    return this.turmas.find(
      (turmaToSearch) =>
        turmaToSearch.codigo_disc === codigo &&
        turmaToSearch.turma === turma &&
        turmaToSearch.ano === ano &&
        turmaToSearch.semestre === semestre
    );
  }

  async queryByAnoESemestre(year: number, semester: number): Promise<Turma[]> {
    return this.turmas.filter(
      (turma) => turma.ano === year && turma.semestre === semester
    );
  }

  async updateById({
    id,
    codigo_disc,
    turma,
    ch,
    ano,
    semestre,
  }: IPatchTurmaDTO): Promise<Turma> {
    const turmaToUpdate = this.turmas.find((turma) => turma.id === id);

    Object.assign(turmaToUpdate, {
      codigo_disc: codigo_disc || turmaToUpdate.codigo_disc,
      turma: turma || turmaToUpdate.turma,
      ch: ch || turmaToUpdate.ch,
      ano: ano || turmaToUpdate.ano,
      semestre: semestre || turmaToUpdate.semestre,
    });

    this.turmas.push(turmaToUpdate);

    return turmaToUpdate;
  }

  async deleteById(id: string): Promise<void> {
    const turmaIndex = this.turmas.findIndex((turma) => turma.id === id);

    if (turmaIndex > -1) {
      this.turmas.splice(turmaIndex, 1);
    }
  }
}

export { TurmasRepositoryTestMock };

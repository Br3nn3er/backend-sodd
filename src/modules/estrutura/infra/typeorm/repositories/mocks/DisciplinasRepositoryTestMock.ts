import {ICreateDisciplinaDTO, IPatchDisciplinaDTO,} from "../../../../dtos/ICreateUpdateDisciplinaDTO";
import {Disciplina} from "../../entities/Disciplina";
import {IDisciplinasRepository} from "../interfaces/IDisciplinasRepository";

class DisciplinasRepositoryTestMock implements IDisciplinasRepository {
  disciplinas: Disciplina[] = [];

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
    const disciplina = new Disciplina();

    Object.assign(disciplina, {
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

    this.disciplinas.push(disciplina);

    return disciplina;
  }

  async listAllDisciplinas(): Promise<Disciplina[]> {
    return this.disciplinas;
  }

  async queryByCodigo(codigo: string): Promise<Disciplina> {
    return this.disciplinas.find(
      (disciplina) => disciplina.codigo === codigo
    );
  }

  async queryBySiapeEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Disciplina[]> {
    throw new Error("Method not implemented.");
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
    const disciplinaToUpdate = this.disciplinas.find(
      (disciplina) => disciplina.codigo === codigo
    );

    Object.assign(disciplinaToUpdate, {
      nome: nome || disciplinaToUpdate.nome,
      ch_teorica: ch_teorica || disciplinaToUpdate.ch_teorica,
      ch_pratica: ch_pratica || disciplinaToUpdate.ch_pratica,
      ch_total: ch_total || disciplinaToUpdate.ch_total,
      curso: curso || disciplinaToUpdate.curso,
      temfila:
        temfila === undefined || temfila === null
          ? disciplinaToUpdate.temfila
          : temfila,
      periodo: periodo || disciplinaToUpdate.periodo,
    });

    this.disciplinas.push(disciplinaToUpdate);

    return disciplinaToUpdate;
  }

  async deleteByCodigo(codigo: string): Promise<void> {
    const disciplinaIndex = this.disciplinas.findIndex(
      (disciplina) => disciplina.codigo === codigo
    );

    if (disciplinaIndex > -1) {
      this.disciplinas.splice(disciplinaIndex, 1);
    }
  }
}

export { DisciplinasRepositoryTestMock };

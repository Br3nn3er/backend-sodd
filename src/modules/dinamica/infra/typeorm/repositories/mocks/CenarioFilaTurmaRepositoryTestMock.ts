import {ICreateCenarioFilaTurmaDTO, IPatchCenarioFilaTurmaDTO,} from "../../../../dtos/ICreateCenarioFilaTurmaDTO";
import {CenarioFilaTurma} from "../../entities/CenarioFilaTurma";
import {ICenarioFilaTurmaRepository} from "../interfaces/ICenarioFilaTurmaRepository";

class CenarioFilaTurmaRepositoryTestMock
  implements ICenarioFilaTurmaRepository
{
  private listCenariosFilaTurma: CenarioFilaTurma[] = [];

  async create({
    num_cenario,
    id_turma,
    id_fila,
    status,
    prioridade,
    posicao,
  }: ICreateCenarioFilaTurmaDTO): Promise<CenarioFilaTurma> {
    const cenarioFila = new CenarioFilaTurma();

    Object.assign(cenarioFila, {
      num_cenario,
      id_turma,
      id_fila,
      status,
      prioridade,
      posicao,
    });

    this.listCenariosFilaTurma.push(cenarioFila);

    return cenarioFila;
  }

  async listCenarios(): Promise<CenarioFilaTurma[]> {
    return this.listCenariosFilaTurma;
  }

  async queryByCenarioETurmaEFila(
    num_cenario: number,
    id_turma: number,
    id_fila: number
  ): Promise<CenarioFilaTurma> {
    return this.listCenariosFilaTurma.find(
      (cenario) =>
        cenario.num_cenario === num_cenario &&
        cenario.id_turma === id_turma &&
        cenario.id_fila === id_fila
    );
  }

  async updateByCenarioETurmaEFila({
    num_cenario,
    id_turma,
    id_fila,
    status,
    prioridade,
    posicao,
  }: IPatchCenarioFilaTurmaDTO): Promise<CenarioFilaTurma> {
    const cenarioFilaToUpdate = this.listCenariosFilaTurma.find(
      (cenario) =>
        cenario.num_cenario === num_cenario &&
        cenario.id_turma === id_turma &&
        cenario.id_fila === id_fila
    );

    Object.assign(cenarioFilaToUpdate, {
      status: status || cenarioFilaToUpdate.status,
      prioridade: prioridade || cenarioFilaToUpdate.prioridade,
      posicao: posicao || cenarioFilaToUpdate.posicao,
    });

    this.listCenariosFilaTurma.push(cenarioFilaToUpdate);

    return cenarioFilaToUpdate;
  }

  async deleteByCenarioETurmaEFila(
    num_cenario: number,
    id_turma: number,
    id_fila: number
  ): Promise<void> {
    const cenarioFilaIndex = this.listCenariosFilaTurma.findIndex(
      (cenario) =>
        cenario.num_cenario === num_cenario &&
        cenario.id_turma === id_turma &&
        cenario.id_fila === id_fila
    );

    if (cenarioFilaIndex > -1) {
      this.listCenariosFilaTurma.splice(cenarioFilaIndex, 1);
    }
  }
}

export { CenarioFilaTurmaRepositoryTestMock };

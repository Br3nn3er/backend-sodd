import {ICreateAtribuicaoManualDTO} from "../../../../dtos/ICreateAtribuicaoManualDTO";
import {AtribuicaoManual} from "../../entities/AtribuicaoManual";
import {IAtribuicaoManualRepository} from "../interfaces/IAtribuicaoManualRepository";

class AtribuicaoManualRepositoryTestMock
  implements IAtribuicaoManualRepository
{
  private atribuicoes: AtribuicaoManual[] = [];

  async create({
    num_cenario,
    siape,
    id_turma,
  }: ICreateAtribuicaoManualDTO): Promise<AtribuicaoManual> {
    const atribuicao = new AtribuicaoManual();

    Object.assign(atribuicao, {
      num_cenario,
      siape,
      id_turma,
    });

    this.atribuicoes.push(atribuicao);

    return atribuicao;
  }

  async listAllAtribuicoes(): Promise<AtribuicaoManual[]> {
    return this.atribuicoes;
  }

  async queryByCenarioETurma(
    num_cenario: number,
    id_turma: number
  ): Promise<AtribuicaoManual> {
    return this.atribuicoes.find(
      (atribuicaoToSearch) =>
        atribuicaoToSearch.num_cenario === num_cenario &&
        atribuicaoToSearch.id_turma === id_turma
    );
  }

  async deleteByCenarioETurma(
    num_cenario: number,
    id_turma: number
  ): Promise<void> {
    const atribuicaoIndex = this.atribuicoes.findIndex(
      (atribuicaoToSearch) =>
        atribuicaoToSearch.num_cenario === num_cenario &&
        atribuicaoToSearch.id_turma === id_turma
    );

    if (atribuicaoIndex > -1) {
      this.atribuicoes.splice(atribuicaoIndex, 1);
    }
  }
}

export { AtribuicaoManualRepositoryTestMock };

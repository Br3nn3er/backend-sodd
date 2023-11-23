import {ICreateCenarioDTO, IPatchCenarioDTO,} from "../../../../dtos/ICreateCenarioDTO";
import {Cenario} from "../../entities/Cenario";
import {ICenarioRepository} from "../interfaces/ICenarioRepository";

class CenarioRepositoryTestMock implements ICenarioRepository {
  private cenarios: Cenario[] = [];
  private count = 0;

  async create({
    descricao_cenario,
    ano,
    semestre,
  }: ICreateCenarioDTO): Promise<Cenario> {
    const cenario = new Cenario();

    this.count += 1;

    Object.assign(cenario, {
      num_cenario: this.count.toString(),
      descricao_cenario,
      ano,
      semestre,
    });

    this.cenarios.push(cenario);

    return cenario;
  }

  async listCenarios(): Promise<Cenario[]> {
    return this.cenarios;
  }

  async queryByNumCenario(num_cenario: string): Promise<Cenario> {
    return this.cenarios.find(
      (cenarioToSearch) => cenarioToSearch.num_cenario === num_cenario
    );
  }

  async queryByAnoESemestre(ano: number, semestre: number): Promise<Cenario> {
    return this.cenarios.find(
      (cenarioToSearch) =>
        cenarioToSearch.ano === ano && cenarioToSearch.semestre === semestre
    );
  }

  async updateByNumCenario({
    num_cenario,
    descricao_cenario,
    ano,
    semestre,
  }: IPatchCenarioDTO): Promise<Cenario> {
    const cenario = this.cenarios.find(
      (cenarioToSearch) => cenarioToSearch.num_cenario === num_cenario
    );

    Object.assign(cenario, {
      descricao_cenario: descricao_cenario || cenario.descricao_cenario,
      ano: ano || cenario.ano,
      semestre: semestre || cenario.semestre,
    });

    this.cenarios.push(cenario);

    return cenario;
  }

  async deleteByNumCenario(num_cenario: string): Promise<void> {
    const cenarioIndex = this.cenarios.findIndex(
      (cenarioToSearch) => cenarioToSearch.num_cenario === num_cenario
    );

    if (cenarioIndex > -1) {
      this.cenarios.splice(cenarioIndex, 1);
    }
  }
}

export { CenarioRepositoryTestMock };

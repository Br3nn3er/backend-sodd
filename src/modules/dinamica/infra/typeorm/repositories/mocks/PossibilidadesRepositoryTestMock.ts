import {ICreatePossibilidadeDTO, IPatchPossibilidadeDTO,} from "../../../../dtos/ICreatePossibilidadeDTO";
import {Possibilidades} from "../../entities/Possibilidades";
import {IPossibilidadesRepository} from "../interfaces/IPossibilidadesRepository";

class PossibilidadesRepositoryTestMock implements IPossibilidadesRepository {
  private possibilidades: Possibilidades[] = [];
  private count = 0;

  async create({
    descricao,
    num_cenario,
  }: ICreatePossibilidadeDTO): Promise<Possibilidades> {
    const possibilidade = new Possibilidades();

    this.count += 1;

    Object.assign(possibilidade, {
      id: this.count.toString(),
      descricao,
      num_cenario,
    });

    this.possibilidades.push(possibilidade);

    return possibilidade;
  }

  async listPossibilidades(): Promise<Possibilidades[]> {
    return this.possibilidades;
  }

  async queryById(id: string): Promise<Possibilidades> {
    return this.possibilidades.find(
      (possibilidade) => possibilidade.id === id
    );
  }

  async queryByNumCenario(num_cenario: number): Promise<Possibilidades> {
    return this.possibilidades.find(
      (possibilidade) => possibilidade.num_cenario === num_cenario
    );
  }

  async updateById({
    id,
    descricao,
    num_cenario,
  }: IPatchPossibilidadeDTO): Promise<Possibilidades> {
    const possibilidadeFounded = this.possibilidades.find(
      (possibilidade) => possibilidade.id === id
    );

    Object.assign(possibilidadeFounded, {
      descricao: descricao || possibilidadeFounded.descricao,
      num_cenario: num_cenario || possibilidadeFounded.num_cenario,
    });

    this.possibilidades.push(possibilidadeFounded);

    return possibilidadeFounded;
  }

  async deleteById(id: string): Promise<void> {
    const possibilidadeIndex = this.possibilidades.findIndex(
      (possibilidade) => possibilidade.id === id
    );

    if (possibilidadeIndex > -1) {
      this.possibilidades.splice(possibilidadeIndex, 1);
    }
  }
}

export { PossibilidadesRepositoryTestMock };

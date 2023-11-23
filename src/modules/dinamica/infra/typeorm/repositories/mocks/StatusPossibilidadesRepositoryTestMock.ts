import {ICreateStatusPossibilidadesDTO} from "../../../../dtos/ICreateStatusPossibilidadesDTO";
import {StatusPossibilidades} from "../../entities/StatusPossibilidades";
import {IStatusPossibilidadesRepository} from "../interfaces/IStatusPossibilidadesRepository";

class StatusPossibilidadesRepositoryTestMock
  implements IStatusPossibilidadesRepository
{
  private statusPossibilidades: StatusPossibilidades[] = [];

  async create({
    id_fila,
    id_possibilidade,
    status,
  }: ICreateStatusPossibilidadesDTO): Promise<StatusPossibilidades> {
    const statusPossibilidade = new StatusPossibilidades();

    Object.assign(statusPossibilidade, { id_fila, id_possibilidade, status });

    this.statusPossibilidades.push(statusPossibilidade);

    return statusPossibilidade;
  }

  async listStatusPossibilidades(): Promise<StatusPossibilidades[]> {
    return this.statusPossibilidades;
  }

  async queryByFilaEPossibilidade(
    id_fila: number,
    id_possibilidade: number
  ): Promise<StatusPossibilidades> {
    return this.statusPossibilidades.find(
      (status) =>
        status.id_fila === id_fila &&
        status.id_possibilidade === id_possibilidade
    );
  }

  async deleteByFilaEPossibilidade(
    id_fila: number,
    id_possibilidade: number
  ): Promise<void> {
    const statusPossibilidadeIndex = this.statusPossibilidades.findIndex(
      (status) =>
        status.id_fila === id_fila &&
        status.id_possibilidade === id_possibilidade
    );

    if (statusPossibilidadeIndex > -1) {
      this.statusPossibilidades.splice(statusPossibilidadeIndex, 1);
    }
  }
}

export { StatusPossibilidadesRepositoryTestMock };

import {
  ICreateStatusDistribuicaoDTO,
  IPatchStatusDistribuicaoDTO,
} from "../../../../dtos/ICreateStatusDistribuicaoDTO";
import {StatusDistribuicao} from "../../entities/StatusDistribuicao";
import {IStatusDistribuicaoRepository} from "../interfaces/IStatusDistribuicaoRepository";

class StatusDistribuicaoRepositoryTestMock
  implements IStatusDistribuicaoRepository
{
  private listStatus: StatusDistribuicao[] = [];
  private count = 0;

  async create({
    id,
    descricao,
  }: ICreateStatusDistribuicaoDTO): Promise<StatusDistribuicao> {
    const status = new StatusDistribuicao();

    this.count += 1;

    Object.assign(status, {
      codigo: this.count.toString(),
      id,
      descricao,
    });

    this.listStatus.push(status);

    return status;
  }

  async listAllStatus(): Promise<StatusDistribuicao[]> {
    return this.listStatus;
  }

  async queryById(id: number): Promise<StatusDistribuicao> {
    return this.listStatus.find(
      (statusToSearch) => statusToSearch.id === id
    );
  }

  async queryByCodigo(codigo: string): Promise<StatusDistribuicao> {
    return this.listStatus.find(
      (statusToSearch) => statusToSearch.codigo === codigo
    );
  }

  async updateByCodigo({
    codigo,
    id,
    descricao,
  }: IPatchStatusDistribuicaoDTO): Promise<StatusDistribuicao> {
    const statusFounded = this.listStatus.find(
      (statusToSearch) => statusToSearch.codigo === codigo
    );

    Object.assign(statusFounded, {
      descricao: descricao || statusFounded.descricao,
      id: id || statusFounded.id,
    });

    this.listStatus.push(statusFounded);

    return statusFounded;
  }

  async deleteByCodigo(codigo: string): Promise<void> {
    const statusIndex = this.listStatus.findIndex(
      (statusToSearch) => statusToSearch.codigo === codigo
    );

    if (statusIndex > -1) {
      this.listStatus.splice(statusIndex, 1);
    }
  }
}

export { StatusDistribuicaoRepositoryTestMock };

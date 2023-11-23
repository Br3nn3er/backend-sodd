import {ICreatePrioridadesDTO, IPatchPrioridadesDTO,} from "../../../../dtos/ICreatePrioridadesDTO";
import {Prioridades} from "../../entities/Prioridades";
import {IPrioridadesRepository} from "../interfaces/IPrioridadesRepository";

class PrioridadesRepositoryTestMock implements IPrioridadesRepository {
  private listPriodidades: Prioridades[] = [];
  private count = 0;

  async create({
    prioridade,
    codigo_disc,
    siape,
  }: ICreatePrioridadesDTO): Promise<Prioridades> {
    const prioridades = new Prioridades();

    this.count += 1;

    Object.assign(prioridades, {
      id: this.count.toString(),
      prioridade,
      codigo_disc,
      siape,
    });

    this.listPriodidades.push(prioridades);

    return prioridades;
  }

  async listAllPrioridades(): Promise<Prioridades[]> {
    return this.listPriodidades;
  }

  async queryById(id: string): Promise<Prioridades> {
    return this.listPriodidades.find(
      (prioridadeToSearch) => prioridadeToSearch.id === id
    );
  }

  async queryBySiapeECodigo(
    siape: string,
    codigo_disc: string
  ): Promise<Prioridades> {
    return this.listPriodidades.find(
      (prioridadeToSearch) =>
        prioridadeToSearch.siape === siape &&
        prioridadeToSearch.codigo_disc === codigo_disc
    );
  }

  async updateById({
    id,
    prioridade,
    codigo_disc,
    siape,
  }: IPatchPrioridadesDTO): Promise<Prioridades> {
    const prioridadeFounded = this.listPriodidades.find(
      (prioridadeToSearch) => prioridadeToSearch.id === id
    );

    Object.assign(prioridadeFounded, {
      prioridade: prioridade || prioridadeFounded.prioridade,
      codigo_disc: codigo_disc || prioridadeFounded.codigo_disc,
      siape: siape || prioridadeFounded.siape,
    });

    this.listPriodidades.push(prioridadeFounded);

    return prioridadeFounded;
  }

  async deleteById(id: string): Promise<void> {
    const prioridadeIndex = this.listPriodidades.findIndex(
      (prioridadeToSearch) => prioridadeToSearch.id === id
    );

    if (prioridadeIndex > -1) {
      this.listPriodidades.splice(prioridadeIndex, 1);
    }
  }
}

export { PrioridadesRepositoryTestMock };

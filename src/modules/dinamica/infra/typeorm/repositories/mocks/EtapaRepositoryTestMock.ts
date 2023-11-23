import {ICreateEtapaDTO, IPatchEtapaDTO,} from "../../../../dtos/ICreateEtapaDTO";
import {Etapa} from "../../entities/Etapa";
import {IEtapaRepository} from "../interfaces/IEtapaRepository";

class EtapaRepositoryTestMock implements IEtapaRepository {
  private etapas: Etapa[] = [];
  private count = 0;

  async create({ codigo, ativo, descricao }: ICreateEtapaDTO): Promise<Etapa> {
    const etapa = new Etapa();

    this.count += 1;

    Object.assign(etapa, {
      id: this.count.toString(),
      codigo,
      ativo,
      descricao,
    });

    this.etapas.push(etapa);

    return etapa;
  }

  async listEtapas(): Promise<Etapa[]> {
    return this.etapas;
  }

  async queryById(id: string): Promise<Etapa> {
    return this.etapas.find((etapa) => etapa.id === id);
  }

  async queryByCodigo(codigo: string): Promise<Etapa> {
    return this.etapas.find((etapa) => etapa.codigo === codigo);
  }

  async updateById({
    id,
    codigo,
    ativo,
    descricao,
  }: IPatchEtapaDTO): Promise<Etapa> {
    const etapaFounded = this.etapas.find((etapa) => etapa.id === id);

    Object.assign(etapaFounded, {
      codigo: codigo || etapaFounded.codigo,
      ativo: ativo === null || ativo === undefined ? etapaFounded.ativo : ativo,
      descricao: descricao || etapaFounded.descricao,
    });

    this.etapas.push(etapaFounded);

    return etapaFounded;
  }

  async deleteById(id: string): Promise<void> {
    const etapaIndex = this.etapas.findIndex((etapa) => etapa.id === id);

    if (etapaIndex > -1) {
      this.etapas.splice(etapaIndex, 1);
    }
  }
}

export { EtapaRepositoryTestMock };

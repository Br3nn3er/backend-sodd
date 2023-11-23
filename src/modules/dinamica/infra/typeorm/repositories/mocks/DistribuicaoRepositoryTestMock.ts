import {ICreateDistribuicaoCargaDTO, IPatchDistribuicaoCargaDTO,} from "../../../../dtos/ICreateDistribuicaoCargaDTO";
import {DistribuicaoCarga} from "../../entities/DistribuicaoCarga";
import {IDistribuicaoCargaRepository} from "../interfaces/IDistribuicaoCargaRepository";

class DistribuicaoCargaRepositoryTestMock
  implements IDistribuicaoCargaRepository
{
  private listDist: DistribuicaoCarga[] = [];

  async create({
    cenario,
    siape,
    regra,
    carga,
  }: ICreateDistribuicaoCargaDTO): Promise<DistribuicaoCarga> {
    const dist = new DistribuicaoCarga();

    Object.assign(dist, { cenario, siape, regra, carga });

    this.listDist.push(dist);

    return dist;
  }

  async listDistribuicoes(): Promise<DistribuicaoCarga[]> {
    return this.listDist;
  }

  async queryByCenarioESiapeERegra(
    cenario: number,
    siape: string,
    regra: string
  ): Promise<DistribuicaoCarga> {
    return this.listDist.find(
      (dist) =>
        dist.cenario === cenario && dist.siape === siape && dist.regra === regra
    );
  }

  async update({
    cenario,
    siape,
    regra,
    carga,
  }: IPatchDistribuicaoCargaDTO): Promise<DistribuicaoCarga> {
    const distFounded = this.listDist.find(
      (dist) =>
        dist.cenario === cenario && dist.siape === siape && dist.regra === regra
    );

    Object.assign(distFounded, {
      carga: carga || distFounded.carga,
    });

    this.listDist.push(distFounded);

    return distFounded;
  }

  async deleteByCenarioESiapeERegra(
    cenario: number,
    siape: string,
    regra: string
  ): Promise<void> {
    const distIndex = this.listDist.findIndex(
      (dist) =>
        dist.cenario === cenario && dist.siape === siape && dist.regra === regra
    );

    if (distIndex > -1) {
      this.listDist.splice(distIndex, 1);
    }
  }
}

export { DistribuicaoCargaRepositoryTestMock };

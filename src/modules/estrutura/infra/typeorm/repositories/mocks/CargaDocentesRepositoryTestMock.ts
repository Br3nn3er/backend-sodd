import {ICreateCargaDocenteDTO, IPatchCargaDocenteDTO,} from "../../../../dtos/ICreateUpdateCargaDocenteDTO";
import {CargaDocente} from "../../entities/CargaDocente";
import {ICargaDocentesRepository} from "../interfaces/ICargaDocentesRepository";

class CargaDocentesRepositoryTestMock implements ICargaDocentesRepository {
  private cargas: CargaDocente[] = [];

  async createCarga({
    siape,
    carga_atual,
    ano,
    semestre,
  }: ICreateCargaDocenteDTO): Promise<CargaDocente> {
    const carga = new CargaDocente();

    Object.assign(carga, {
      siape,
      carga_atual,
      ano,
      semestre,
    });

    this.cargas.push(carga);

    return carga;
  }

  async queryBySiape(siape: string): Promise<CargaDocente> {
    return this.cargas.find((carga) => carga.siape === siape);
  }

  async listAllCargas(): Promise<CargaDocente[]> {
    return this.cargas;
  }

  async updateBySiape({
    siape,
    carga_atual,
    ano,
    semestre,
  }: IPatchCargaDocenteDTO): Promise<CargaDocente> {
    const cargaToUpdate = this.cargas.find((carga) => carga.siape === siape);

    Object.assign(cargaToUpdate, {
      carga_atual: carga_atual || cargaToUpdate.carga_atual,
      ano: ano || cargaToUpdate.ano,
      semestre: semestre || cargaToUpdate.semestre,
    });

    this.cargas.push(cargaToUpdate);

    return cargaToUpdate;
  }

  async deleteBySiape(siape: string): Promise<void> {
    const cargaIndex = this.cargas.findIndex((carga) => carga.siape === siape);

    if (cargaIndex > -1) {
      this.cargas.splice(cargaIndex, 1);
    }
  }
}

export { CargaDocentesRepositoryTestMock };

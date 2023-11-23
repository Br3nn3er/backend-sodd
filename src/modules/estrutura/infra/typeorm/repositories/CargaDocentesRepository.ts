import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateCargaDocenteDTO,
  IPatchCargaDocenteDTO,
} from "../../../dtos/ICreateUpdateCargaDocenteDTO";
import { CargaDocente } from "../entities/CargaDocente";
import { ICargaDocentesRepository } from "./interfaces/ICargaDocentesRepository";

class CargaDocentesRepository implements ICargaDocentesRepository {
  private repository: Repository<CargaDocente>;

  constructor() {
    this.repository = dataSource.getRepository(CargaDocente);
  }

  async createCarga({
    siape,
    carga_atual,
    ano,
    semestre,
  }: ICreateCargaDocenteDTO): Promise<CargaDocente> {
    const carga = this.repository.create({
      siape,
      carga_atual,
      ano,
      semestre,
    });

    await this.repository.save(carga);

    return carga;
  }

  async queryBySiape(siape: string): Promise<CargaDocente> {
    return this.repository.findOneBy({ siape });
  }

  async listAllCargas(): Promise<CargaDocente[]> {
    return this.repository
      .createQueryBuilder("carga_docentes")
      .orderBy("siape", "ASC")
      .getMany();
  }

  async updateBySiape({
    siape,
    carga_atual,
    ano,
    semestre,
  }: IPatchCargaDocenteDTO): Promise<CargaDocente> {
    const cargaToUpdate = await this.repository.findOneBy({ siape });

    cargaToUpdate.carga_atual = carga_atual || cargaToUpdate.carga_atual;
    cargaToUpdate.ano = ano || cargaToUpdate.ano;
    cargaToUpdate.semestre = semestre || cargaToUpdate.semestre;

    await this.repository.save(cargaToUpdate);

    return cargaToUpdate;
  }

  async deleteBySiape(siape: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(CargaDocente)
      .where("siape = :siape", { siape })
      .execute();
  }
}

export { CargaDocentesRepository };

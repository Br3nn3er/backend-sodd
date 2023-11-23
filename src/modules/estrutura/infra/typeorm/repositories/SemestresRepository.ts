import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateSemestreDTO,
  IPatchSemestreDTO,
} from "../../../dtos/ICreateUpdateSemestreDTO";
import { Semestre } from "../entities/Semestre";
import { ISemestresRepository } from "./interfaces/ISemestresRepository";

class SemestresRepository implements ISemestresRepository {
  private repository: Repository<Semestre>;

  constructor() {
    this.repository = dataSource.getRepository(Semestre);
  }

  async createSemestre({
    ano,
    semestre,
    status,
  }: ICreateSemestreDTO): Promise<Semestre> {
    const semestreToCreate = this.repository.create({
      ano,
      semestre,
      status,
    });

    await this.repository.save(semestreToCreate);

    return semestreToCreate;
  }

  async listAllSemestres(): Promise<Semestre[]> {
    return this.repository
      .createQueryBuilder("semestres")
      .orderBy("id", "ASC")
      .getMany();
  }

  async queryById(id: number): Promise<Semestre> {
    return this.repository.findOneBy({ id });
  }

  async queryByAnoSemestre(ano: number, semestre: number): Promise<Semestre> {
    return this.repository.findOne({
      where: { ano, semestre },
    });
  }

  async updateById({
    id,
    ano,
    semestre,
    status,
  }: IPatchSemestreDTO): Promise<Semestre> {
    const semestreToUpdate = await this.repository.findOneBy({ id });

    semestreToUpdate.ano = ano || semestreToUpdate.ano;
    semestreToUpdate.semestre = semestre || semestreToUpdate.semestre;
    semestreToUpdate.status =
      status === null || status === undefined
        ? semestreToUpdate.status
        : status;

    await this.repository.save(semestreToUpdate);

    return semestreToUpdate;
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

export { SemestresRepository };

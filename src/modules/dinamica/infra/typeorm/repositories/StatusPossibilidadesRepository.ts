import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { ICreateStatusPossibilidadesDTO } from "../../../dtos/ICreateStatusPossibilidadesDTO";
import { StatusPossibilidades } from "../entities/StatusPossibilidades";
import { IStatusPossibilidadesRepository } from "./interfaces/IStatusPossibilidadesRepository";

class StatusPossibilidadesRepository
  implements IStatusPossibilidadesRepository
{
  private repository: Repository<StatusPossibilidades>;

  constructor() {
    this.repository = dataSource.getRepository(StatusPossibilidades);
  }

  async create({
    id_fila,
    id_possibilidade,
    status,
  }: ICreateStatusPossibilidadesDTO): Promise<StatusPossibilidades> {
    const statusPossibilidade = this.repository.create({
      id_fila,
      id_possibilidade,
      status,
    });

    console.log(statusPossibilidade);

    await this.repository.save(statusPossibilidade);

    return statusPossibilidade;
  }

  async listStatusPossibilidades(): Promise<StatusPossibilidades[]> {
    return this.repository
      .createQueryBuilder("status_possibilidade")
      .orderBy("id_fila")
      .getMany();
  }

  async queryByFilaEPossibilidade(
    id_fila: number,
    id_possibilidade: number
  ): Promise<StatusPossibilidades> {
    return this.repository.findOne({
      where: { id_fila, id_possibilidade },
    });
  }

  async deleteByFilaEPossibilidade(
    id_fila: number,
    id_possibilidade: number
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(StatusPossibilidades)
      .where("id_fila = :id_fila", { id_fila })
      .andWhere("id_possibilidade = :id_possibilidade", { id_possibilidade })
      .execute();
  }
}

export { StatusPossibilidadesRepository };

import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import {
  ICreateHorarioDTO,
  IPatchHorarioDTO,
} from "../../../dtos/ICreateUpdateHorarioDTO";
import { Horario } from "../entities/Horario";
import { IHorariosRepository } from "./interfaces/IHorariosRepository";

class HorariosRepository implements IHorariosRepository {
  private repository: Repository<Horario>;

  constructor() {
    this.repository = dataSource.getRepository(Horario);
  }

  async createHorario({
    letra,
    hora_inicio,
    hora_fim,
    turno,
  }: ICreateHorarioDTO): Promise<Horario> {
    const horario = this.repository.create({
      letra,
      hora_inicio,
      hora_fim,
      turno,
    });

    await this.repository.save(horario);

    return horario;
  }

  async queryByLetra(letra: string): Promise<Horario> {
    return this.repository.findOneBy({ letra });
  }

  async listAllHorarios(): Promise<Horario[]> {
    return this.repository
      .createQueryBuilder("horario")
      .orderBy("letra", "ASC")
      .getMany();
  }

  async updateHorarioByLetra({
    letra,
    hora_inicio,
    hora_fim,
    turno,
  }: IPatchHorarioDTO): Promise<Horario> {
    const horarioToUpdate = await this.repository.findOneBy({ letra });

    horarioToUpdate.hora_inicio = hora_inicio || horarioToUpdate.hora_inicio;
    horarioToUpdate.hora_fim = hora_fim || horarioToUpdate.hora_fim;
    horarioToUpdate.turno = turno || horarioToUpdate.turno;

    await this.repository.save(horarioToUpdate);

    return horarioToUpdate;
  }

  async deleteByLetra(letra: string): Promise<void> {
    await this.repository.delete(letra);
  }
}

export { HorariosRepository };

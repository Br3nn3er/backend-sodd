import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { ICreateOfertaDTO } from "../../../dtos/ICreateOfertaDTO";
import { Oferta } from "../entities/Oferta";
import { IOfertaRepository } from "./interfaces/IOfertaRepository";

class OfertaRepository implements IOfertaRepository {
  private repository: Repository<Oferta>;

  constructor() {
    this.repository = dataSource.getRepository(Oferta);
  }

  async create({ dia, letra, id_turma }: ICreateOfertaDTO): Promise<Oferta> {
    const oferta = this.repository.create({ dia, letra, id_turma });

    await this.repository.save(oferta);

    return oferta;
  }

  async listOfertas(): Promise<Oferta[]> {
    return this.repository
      .createQueryBuilder("oferta")
      .orderBy("id", "ASC")
      .getMany();
  }

  async listByTurmaIdAndSemestreAndAno(
    turmaId: number,
    ano: number,
    semestre: number
  ): Promise<Oferta[]> {
    return this.repository
      .createQueryBuilder("oferta")
      .innerJoinAndSelect("oferta.horario", "horario")
      .innerJoinAndSelect("oferta.turma", "turma")
      .innerJoinAndSelect("turma.fila_turma_new", "fila_new")
      .where(
        "turma.id = :turmaId AND turma.ano = :ano AND turma.semestre = :semestre",
        { ano, semestre, turmaId }
      )
      .orderBy("oferta.id", "ASC")
      .printSql()
      .getMany();
  }

  async queryById(id: string): Promise<Oferta> {
    return this.repository.findOneBy({ id });
  }

  async queryByDiaELetraETurma(
    dia: string,
    letra: string,
    id_turma: number
  ): Promise<Oferta> {
    return this.repository.findOne({
      where: { dia, letra, id_turma },
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { OfertaRepository };

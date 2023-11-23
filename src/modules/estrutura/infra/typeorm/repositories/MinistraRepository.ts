import { Repository } from "typeorm";

import { dataSource } from "../../../../../shared/infra/typeorm";
import { Oferta } from "../../../../dinamica/infra/typeorm/entities/Oferta";
import { ICreateMinistraDTO } from "../../../dtos/ICreateMinistraDTO";
import { Ministra } from "../entities/Ministra";
import { IMinistraRepository } from "./interfaces/IMinistraRepository";

class MinistraRepository implements IMinistraRepository {
  private repository: Repository<Ministra>;

  constructor() {
    this.repository = dataSource.getRepository(Ministra);
  }

  async create({ siape, id_turma }: ICreateMinistraDTO): Promise<Ministra> {
    const ministra = this.repository.create({ siape, id_turma });

    await this.repository.save(ministra);

    return ministra;
  }

  async listAllMinistra(): Promise<Ministra[]> {
    return this.repository
      .createQueryBuilder("ministra")
      .orderBy("siape", "ASC")
      .getMany();
  }

  async listMinistraByProfessorAndSemestre(
    siapes: string[],
    ano: number,
    semestre: number
  ): Promise<Ministra[]> {
    return this.repository
      .createQueryBuilder("ministra")
      .innerJoinAndSelect("ministra.turma", "turma")
      .innerJoinAndMapMany(
        "ministra.ofertas",
        Oferta,
        "ofertas",
        "ministra.id_turma = ofertas.id_turma"
      )
      .where(
        "ministra.siape IN (:...siapes) AND turma.ano = :ano AND turma.semestre = :semestre",
        { ano, semestre, siapes }
      )
      .getMany();
  }

  async listByTurmasAndSemestre(
    turmaIds: number[],
    ano: number,
    semestre: number
  ): Promise<Ministra[]> {
    return this.repository
      .createQueryBuilder("ministra")
      .innerJoinAndSelect("ministra.turma", "turma")
      .innerJoinAndMapMany(
        "ministra.ofertas",
        Oferta,
        "ofertas",
        "ministra.id_turma = ofertas.id_turma"
      )
      .where(
        "turma.ano = :ano AND turma.semestre = :semestre AND turma.id IN (:...turmaIds)",
        { ano, semestre, turmaIds }
      )
      .getMany();
  }

  async queryBySiapeAndIdTurma(
    siape: string,
    id_turma: string
  ): Promise<Ministra> {
    return this.repository.findOne({
      where: { siape, id_turma },
    });
  }

  async deleteBySiapeAndIdTurma(
    siape: string,
    id_turma: string
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(Ministra)
      .where("siape = :siape", { siape })
      .andWhere("id_turma = :id_turma", { id_turma })
      .execute();
  }
}

export { MinistraRepository };

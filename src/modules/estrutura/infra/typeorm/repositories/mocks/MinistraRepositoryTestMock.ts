import {ICreateMinistraDTO} from "../../../../dtos/ICreateMinistraDTO";
import {Ministra} from "../../entities/Ministra";
import {IMinistraRepository} from "../interfaces/IMinistraRepository";

class MinistraRepositoryTestMock implements IMinistraRepository {
  listByTurmasAndSemestre(
    turmaIds: number[],
    ano: number,
    semestre: number
  ): Promise<Ministra[]> {
    throw new Error("Method not implemented.");
  }
  listMinistraByProfessorAndSemestre(
    siapes: string[],
    ano: number,
    semestre: number
  ): Promise<Ministra[]> {
    throw new Error("Method not implemented.");
  }
  private listMinistra: Ministra[] = [];

  async create({ siape, id_turma }: ICreateMinistraDTO): Promise<Ministra> {
    const ministra = new Ministra();

    Object.assign(ministra, { siape, id_turma });

    this.listMinistra.push(ministra);

    return ministra;
  }

  async listAllMinistra(): Promise<Ministra[]> {
    return this.listMinistra;
  }

  async queryBySiapeAndIdTurma(
    siape: string,
    id_turma: string
  ): Promise<Ministra> {
    return this.listMinistra.find(
      (ministra) => ministra.siape === siape && ministra.id_turma === id_turma
    );
  }

  async deleteBySiapeAndIdTurma(
    siape: string,
    id_turma: string
  ): Promise<void> {
    const ministraIndex = this.listMinistra.findIndex(
      (ministra) => ministra.siape === siape && ministra.id_turma === id_turma
    );

    if (ministraIndex > -1) {
      this.listMinistra.splice(ministraIndex, 1);
    }
  }
}

export { MinistraRepositoryTestMock };

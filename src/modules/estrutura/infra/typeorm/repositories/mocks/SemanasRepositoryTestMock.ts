import {ICreateSemanaDTO, IPatchSemanaDTO,} from "../../../../dtos/ICreateUpdateSemanaDTO";
import {Semana} from "../../entities/Semana";
import {ISemanasRepository} from "../interfaces/ISemanasRepository";

class SemanasRepositoryTestMock implements ISemanasRepository {
  private semanas: Semana[] = [];

  async createSemana({ dia, descricao }: ICreateSemanaDTO): Promise<Semana> {
    const semana = new Semana();

    Object.assign(semana, { dia, descricao });

    this.semanas.push(semana);

    return semana;
  }

  async listAllSemanas(): Promise<Semana[]> {
    return this.semanas;
  }

  async queryByDia(dia: string): Promise<Semana> {
    return this.semanas.find((semana) => semana.dia === dia);
  }

  async update({ dia, descricao }: IPatchSemanaDTO): Promise<Semana> {
    const semana = this.semanas.find((semana) => semana.dia === dia);

    Object.assign(semana, {
      descricao: descricao || semana.descricao,
    });

    this.semanas.push(semana);

    return semana;
  }

  async deleteByDia(dia: string): Promise<void> {
    const semanaIndex = this.semanas.findIndex((semana) => semana.dia === dia);

    if (semanaIndex > -1) {
      this.semanas.splice(semanaIndex, 1);
    }
  }
}

export { SemanasRepositoryTestMock };

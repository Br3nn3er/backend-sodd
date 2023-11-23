import {inject, injectable} from "tsyringe";

import {IDateProvider} from "../../../../../../shared/container/providers/DateProvider/IDateProvider";
import {ICreateProfessoresDTO, IPatchProfessorDTO,} from "../../../../dtos/ICreateUpdateProfessoresDTO";
import {Professor} from "../../entities/Professor";
import {IProfessoresRepository} from "../interfaces/IProfessoresRepository";

@injectable()
class ProfessoresRepositoryTestMock implements IProfessoresRepository {
  professores: Professor[] = [];

  constructor(
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async createProfessor({
    siape,
    nome,
    data_ingresso,
    data_nasc,
    afastado,
    regime,
    carga_atual,
    locacao,
    cnome,
    data_saida,
    data_exoneracao,
    data_aposentadoria,
    status,
  }: ICreateProfessoresDTO): Promise<Professor> {
    const professor = new Professor();

    Object.assign(professor, {
      siape,
      nome,
      data_ingresso,
      data_nasc,
      afastado,
      regime,
      carga_atual,
      locacao,
      cnome,
      data_saida,
      data_exoneracao,
      data_aposentadoria,
      status,
    });

    this.professores.push(professor);

    return professor;
  }

  async listAllProfessores(): Promise<Professor[]> {
    return this.professores;
  }

  async queryBySiape(siape: string): Promise<Professor> {
    return this.professores.find(
      (professor) => professor.siape === siape
    );
  }

  async updateBySiape({
    siape,
    nome,
    data_ingresso,
    data_nasc,
    afastado,
    regime,
    carga_atual,
    locacao,
    cnome,
    data_saida,
    data_exoneracao,
    data_aposentadoria,
    status,
  }: IPatchProfessorDTO): Promise<Professor> {
    const professorToUpdate = this.professores.find(
      (professor) => professor.siape === siape
    );

    Object.assign(professorToUpdate, {
      nome: nome || professorToUpdate.nome,

      data_ingresso: data_ingresso
        ? this.dateProvider.processDateToUTC(data_ingresso)
        : professorToUpdate.data_ingresso,

      data_nasc: data_nasc
        ? this.dateProvider.processDateToUTC(data_nasc)
        : professorToUpdate.data_nasc,

      afastado:
        afastado === null || afastado === undefined
          ? professorToUpdate.afastado
          : afastado,

      regime: regime || professorToUpdate.regime,

      carga_atual: carga_atual || professorToUpdate.carga_atual,

      locacao: locacao || professorToUpdate.locacao,

      cnome: cnome || professorToUpdate.cnome,

      data_saida: data_saida
        ? this.dateProvider.processDateToUTC(data_saida)
        : professorToUpdate.data_saida,

      data_exoneracao: data_exoneracao
        ? this.dateProvider.processDateToUTC(data_exoneracao)
        : professorToUpdate.data_exoneracao,

      data_aposentadoria: data_aposentadoria
        ? this.dateProvider.processDateToUTC(data_aposentadoria)
        : professorToUpdate.data_aposentadoria,

      status: status || professorToUpdate.status,
    });

    this.professores.push(professorToUpdate);

    return professorToUpdate;
  }

  async deleteBySiape(siape: string): Promise<void> {
    const professorIndex = this.professores.findIndex(
      (professor) => professor.siape === siape
    );

    if (professorIndex > -1) {
      this.professores.splice(professorIndex, 1);
    }
  }
}

export { ProfessoresRepositoryTestMock };

import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { IDateProvider } from "../../../../shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IPatchProfessorDTO } from "../../dtos/ICreateUpdateProfessoresDTO";
import { Professor } from "../../infra/typeorm/entities/Professor";
import { IProfessoresRepository } from "../../infra/typeorm/repositories/interfaces/IProfessoresRepository";

interface IRequest {
  siape: string;
  nome: string;
  data_ingresso: Date;
  data_nasc: Date;
  afastado: boolean;
  regime: string;
  carga_atual: number;
  locacao: string;
  cnome: string;
  data_saida: Date;
  data_exoneracao: Date;
  data_aposentadoria: Date;
  status: string;
}

interface IImportProfessor {
  siape: string;
  nome: string;
  data_ingresso?: Date;
  data_nasc?: Date;
  afastado: boolean;
  regime: string;
  carga_atual: number;
  locacao: string;
  cnome: string;
  data_saida?: Date;
  data_exoneracao?: Date;
  data_aposentadoria?: Date;
  status: string;
}

@injectable()
class HandleProfessorService {
  constructor(
    @inject("ProfessoresRepository")
    private professoresRepository: IProfessoresRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async create({
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
  }: IRequest): Promise<Professor> {
    const existentProfessor = await this.professoresRepository.queryBySiape(
      siape
    );

    if (existentProfessor) {
      throw new AppError(
        "Há um professor cadastrado com este código SIAPE",
        403
      );
    }

    return this.professoresRepository.createProfessor({
      siape,
      nome,
      data_ingresso: data_ingresso
        ? this.dateProvider.processDateToUTC(data_ingresso)
        : null,
      data_nasc: data_nasc
        ? this.dateProvider.processDateToUTC(data_nasc)
        : null,
      afastado,
      regime,
      carga_atual,
      locacao,
      cnome,
      data_saida: data_saida
        ? this.dateProvider.processDateToUTC(data_saida)
        : null,
      data_exoneracao: data_exoneracao
        ? this.dateProvider.processDateToUTC(data_exoneracao)
        : null,
      data_aposentadoria: data_aposentadoria
        ? this.dateProvider.processDateToUTC(data_aposentadoria)
        : null,
      status,
    });
  }

  async read(): Promise<Professor[]> {
    const professores = await this.professoresRepository.listAllProfessores();

    professores.forEach((professor) => {
      // eslint-disable-next-line no-param-reassign
      professor.siape = professor.siape.trim();
    });

    return professores;
  }

  async readBySiape(siape: string): Promise<Professor> {
    const professor = await this.professoresRepository.queryBySiape(siape);
    professor.siape = professor.siape.trim();

    return professor;
  }

  async update({
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
    const professorExistent = await this.professoresRepository.queryBySiape(
      siape
    );

    if (!professorExistent) {
      throw new AppError("Este professor não está cadastrado!");
    }

    return this.professoresRepository.updateBySiape({
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
  }

  async delete(siape: string): Promise<void> {
    await this.professoresRepository.deleteBySiape(siape);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const professores = await this.loadProfessores(file);

    professores.map(async (professor) => {
      const {
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
      } = professor;

      const professorExistance = await this.professoresRepository.queryBySiape(
        siape
      );

      if (!professorExistance) {
        console.log(professor);

        await this.professoresRepository.createProfessor({
          siape,
          nome,
          data_ingresso: data_ingresso
            ? this.dateProvider.processDateToUTC(data_ingresso)
            : null,
          data_nasc: data_nasc
            ? this.dateProvider.processDateToUTC(data_nasc)
            : null,
          afastado,
          regime,
          carga_atual,
          locacao,
          cnome,
          data_saida: data_saida
            ? this.dateProvider.processDateToUTC(data_saida)
            : null,
          data_exoneracao: data_exoneracao
            ? this.dateProvider.processDateToUTC(data_exoneracao)
            : null,
          data_aposentadoria: data_aposentadoria
            ? this.dateProvider.processDateToUTC(data_aposentadoria)
            : null,
          status,
        });
      }
    });
  }

  private loadProfessores(
    file: Express.Multer.File
  ): Promise<IImportProfessor[]> {
    return new Promise((resolve, reject) => {
      const professores: IImportProfessor[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [
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
          ] = line;

          professores.push({
            siape,
            nome,
            data_ingresso,
            data_nasc,
            afastado: afastado.toLowerCase() === "true",
            regime,
            carga_atual,
            locacao,
            cnome,
            data_saida,
            data_exoneracao,
            data_aposentadoria,
            status,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(professores);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleProfessorService };

import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchSemanaDTO } from "../../dtos/ICreateUpdateSemanaDTO";
import { Semana } from "../../infra/typeorm/entities/Semana";
import { ISemanasRepository } from "../../infra/typeorm/repositories/interfaces/ISemanasRepository";

interface IRequest {
  dia: string;
  descricao: string;
}

interface IImportSemana {
  dia: string;
  descricao: string;
}

@injectable()
class HandleSemanaService {
  constructor(
    @inject("SemanasRepository")
    private semanasRepository: ISemanasRepository
  ) {}

  async create({ dia, descricao }: IRequest): Promise<Semana> {
    const semanaExistent = await this.semanasRepository.queryByDia(dia);

    if (semanaExistent) {
      throw new AppError("Dia já cadastrado!");
    }

    return this.semanasRepository.createSemana({
      dia,
      descricao,
    });
  }

  async read(): Promise<Semana[]> {
    const semanas = await this.semanasRepository.listAllSemanas();

    semanas.forEach((semana) => {
      // eslint-disable-next-line no-param-reassign
      semana.descricao = semana.descricao.trim();
    });
    return semanas;
  }

  async update({ dia, descricao }: IPatchSemanaDTO): Promise<Semana> {
    const semana = await this.semanasRepository.queryByDia(dia);

    if (!semana) {
      throw new AppError("Registro não consta no sistema!");
    }

    return this.semanasRepository.update({
      dia,
      descricao,
    });
  }

  async delete(dia: string): Promise<void> {
    await this.semanasRepository.deleteByDia(dia);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const semanas = await this.loadSemanas(file);

    semanas.map(async (semana) => {
      const { dia, descricao } = semana;

      console.log(semana);

      await this.semanasRepository.createSemana({ dia, descricao });
    });
  }

  private loadSemanas(file: Express.Multer.File): Promise<IImportSemana[]> {
    return new Promise((resolve, reject) => {
      const semanas: IImportSemana[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [dia, descricao] = line;

          semanas.push({
            dia,
            descricao,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(semanas);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleSemanaService };

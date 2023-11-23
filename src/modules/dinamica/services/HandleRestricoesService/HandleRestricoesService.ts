import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { Restricoes } from "../../infra/typeorm/entities/Restricoes";
import { IRestricoesRepository } from "../../infra/typeorm/repositories/interfaces/IRestricoesRepository";

interface IHandleRestricoes {
  siape: string;
  dia: string;
  letra: string;
}

@injectable()
class HandleRestricoesService {
  constructor(
    @inject("RestricoesRepository")
    private restricoesRepository: IRestricoesRepository
  ) {}

  async create({ siape, dia, letra }: IHandleRestricoes): Promise<Restricoes> {
    const restricoesFounded =
      await this.restricoesRepository.queryBySiapeEDiaELetra(siape, dia, letra);

    if (restricoesFounded) {
      throw new AppError("Restricao já cadastrada!");
    }

    return this.restricoesRepository.create({
      siape,
      dia,
      letra,
    });
  }

  createMany(data: IHandleRestricoes[]): Promise<Restricoes[]> {
    return this.restricoesRepository.createMany(data);
  }

  deleteBySiape(siape: string): Promise<void> {
    return this.restricoesRepository.deleteBySiape(siape);
  }

  async read(): Promise<Restricoes[]> {
    const listRestricoes = await this.restricoesRepository.listRestricoes();

    listRestricoes.forEach((restricoesToTrim) => {
      // eslint-disable-next-line no-param-reassign
      restricoesToTrim.siape = restricoesToTrim.siape.trim();
    });

    return listRestricoes;
  }
  async readBySiape(siape: string): Promise<Restricoes[]> {
    const listRestricoes = await this.restricoesRepository.queryBySiape(siape);

    listRestricoes.forEach((restricoesToTrim) => {
      // eslint-disable-next-line no-param-reassign
      restricoesToTrim.siape = restricoesToTrim.siape.trim();
    });

    return listRestricoes;
  }

  async delete(siape: string, dia: string, letra: string): Promise<void> {
    await this.restricoesRepository.deleteBySiapeEDiaELetra(siape, dia, letra);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const listRestricoes = await this.loadRestricoes(file);

    listRestricoes.map(async (restricoesToProcess) => {
      const { siape, dia, letra } = restricoesToProcess;

      console.log(restricoesToProcess);

      await this.restricoesRepository.create({
        siape,
        dia,
        letra,
      });
    });
  }

  private loadRestricoes(
    file: Express.Multer.File
  ): Promise<IHandleRestricoes[]> {
    return new Promise((resolve, reject) => {
      const listRestricoes: IHandleRestricoes[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [siape, dia, letra] = line;

          listRestricoes.push({
            siape,
            dia,
            letra,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(listRestricoes);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleRestricoesService };

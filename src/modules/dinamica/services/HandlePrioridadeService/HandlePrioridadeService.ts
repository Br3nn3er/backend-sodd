import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchPrioridadesDTO } from "../../dtos/ICreatePrioridadesDTO";
import { Prioridades } from "../../infra/typeorm/entities/Prioridades";
import { IPrioridadesRepository } from "../../infra/typeorm/repositories/interfaces/IPrioridadesRepository";

interface IHandlePrioridades {
  prioridade: number;
  codigo_disc: string;
  siape: string;
}

@injectable()
class HandlePrioridadeService {
  constructor(
    @inject("PrioridadesRepository")
    private prioridadesRepository: IPrioridadesRepository
  ) {}

  async create({
    prioridade,
    codigo_disc,
    siape,
  }: IHandlePrioridades): Promise<Prioridades> {
    return this.prioridadesRepository.create({
      prioridade,
      codigo_disc,
      siape,
    });
  }

  async read(): Promise<Prioridades[]> {
    const listPrioridades =
      await this.prioridadesRepository.listAllPrioridades();

    listPrioridades.forEach((prioridadeToTrim) => {
      // eslint-disable-next-line no-param-reassign
      prioridadeToTrim.siape = prioridadeToTrim.siape.trim();
    });

    return listPrioridades;
  }

  async update({
    id,
    prioridade,
    codigo_disc,
    siape,
  }: IPatchPrioridadesDTO): Promise<Prioridades> {
    const prioridadeFounded = await this.prioridadesRepository.queryById(id);

    if (!prioridadeFounded) {
      throw new AppError("Prioridade não cadastrada!");
    }

    return this.prioridadesRepository.updateById({
      id,
      prioridade,
      codigo_disc,
      siape,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prioridadesRepository.deleteById(id);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const listPrioridades = await this.loadPrioridades(file);

    listPrioridades.map(async (prioridadeToProcess) => {
      const { prioridade, codigo_disc, siape } = prioridadeToProcess;

      console.log(prioridadeToProcess);

      await this.prioridadesRepository.create({
        prioridade,
        codigo_disc,
        siape,
      });
    });
  }

  private loadPrioridades(
    file: Express.Multer.File
  ): Promise<IHandlePrioridades[]> {
    return new Promise((resolve, reject) => {
      const listPrioridades: IHandlePrioridades[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [prioridade, codigo_disc, siape] = line;

          listPrioridades.push({
            prioridade: parseInt(prioridade, 10),
            codigo_disc,
            siape,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(listPrioridades);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandlePrioridadeService };

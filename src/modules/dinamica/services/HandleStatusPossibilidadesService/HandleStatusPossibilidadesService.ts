import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { StatusPossibilidades } from "../../infra/typeorm/entities/StatusPossibilidades";
import { IStatusPossibilidadesRepository } from "../../infra/typeorm/repositories/interfaces/IStatusPossibilidadesRepository";

interface IHandleStatusPossibilidades {
  id_fila: number;
  id_possibilidade: number;
  status: number;
}

@injectable()
class HandleStatusPossibilidadesService {
  constructor(
    @inject("StatusPossibilidadesRepository")
    private statusFilaRepository: IStatusPossibilidadesRepository
  ) {}

  async create({
    id_fila,
    id_possibilidade,
    status,
  }: IHandleStatusPossibilidades): Promise<StatusPossibilidades> {
    const statusFilaExistent =
      await this.statusFilaRepository.queryByFilaEPossibilidade(
        id_fila,
        id_possibilidade
      );

    if (statusFilaExistent) {
      throw new AppError("Possibilidade já cadastrada!");
    }

    return this.statusFilaRepository.create({
      id_fila,
      id_possibilidade,
      status,
    });
  }

  async read(): Promise<StatusPossibilidades[]> {
    return this.statusFilaRepository.listStatusPossibilidades();
  }

  async delete(id_fila: number, id_possibilidade: number): Promise<void> {
    await this.statusFilaRepository.deleteByFilaEPossibilidade(
      id_fila,
      id_possibilidade
    );
  }

  async import(file: Express.Multer.File): Promise<void> {
    const statusFilas = await this.loadStatusPossibilidades(file);

    statusFilas.map(async (statusFilaToProcess) => {
      const { id_fila, id_possibilidade, status } = statusFilaToProcess;

      console.log(statusFilaToProcess);

      const statusFilaFounded =
        await this.statusFilaRepository.queryByFilaEPossibilidade(
          id_fila,
          id_possibilidade
        );

      if (!statusFilaFounded) {
        await this.statusFilaRepository.create({
          id_fila,
          id_possibilidade,
          status,
        });
      }
    });
  }

  private loadStatusPossibilidades(
    file: Express.Multer.File
  ): Promise<IHandleStatusPossibilidades[]> {
    return new Promise((resolve, reject) => {
      const statusFilas: IHandleStatusPossibilidades[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [id_fila, id_possibilidade, status] = line;

          statusFilas.push({
            id_fila: parseInt(id_fila, 10),
            id_possibilidade: parseInt(id_possibilidade, 10),
            status: parseInt(status, 10),
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(statusFilas);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleStatusPossibilidadesService };

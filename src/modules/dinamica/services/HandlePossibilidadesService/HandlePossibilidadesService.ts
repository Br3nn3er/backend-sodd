import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchPossibilidadeDTO } from "../../dtos/ICreatePossibilidadeDTO";
import { Possibilidades } from "../../infra/typeorm/entities/Possibilidades";
import { IPossibilidadesRepository } from "../../infra/typeorm/repositories/interfaces/IPossibilidadesRepository";

interface IHandlePossibilidades {
  descricao: string;
  num_cenario: number;
}

@injectable()
class HandlePossibilidadesService {
  constructor(
    @inject("PossibilidadesRepository")
    private possibilidadeRepository: IPossibilidadesRepository
  ) {}

  async create({
    descricao,
    num_cenario,
  }: IHandlePossibilidades): Promise<Possibilidades> {
    return this.possibilidadeRepository.create({
      descricao,
      num_cenario,
    });
  }

  async read(): Promise<Possibilidades[]> {
    const possibilidades =
      await this.possibilidadeRepository.listPossibilidades();

    possibilidades.forEach((possibilidade) => {
      // eslint-disable-next-line no-param-reassign
      possibilidade.descricao = possibilidade.descricao
        ? possibilidade.descricao.trim()
        : null;
    });

    return possibilidades;
  }

  async update({
    id,
    descricao,
    num_cenario,
  }: IPatchPossibilidadeDTO): Promise<Possibilidades> {
    const possibilidadeFounded = await this.possibilidadeRepository.queryById(
      id
    );

    if (!possibilidadeFounded) {
      throw new AppError("Possibilidade não encontrada!", 403);
    }

    return this.possibilidadeRepository.updateById({
      id,
      descricao,
      num_cenario,
    });
  }

  async delete(id: string): Promise<void> {
    await this.possibilidadeRepository.deleteById(id);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const listPossibilidades = await this.loadPossibilidades(file);

    listPossibilidades.map(async (possibilidadeToProcess) => {
      const { descricao, num_cenario } = possibilidadeToProcess;

      console.log(possibilidadeToProcess);

      await this.possibilidadeRepository.create({
        descricao,
        num_cenario,
      });
    });
  }

  private loadPossibilidades(
    file: Express.Multer.File
  ): Promise<IHandlePossibilidades[]> {
    return new Promise((resolve, reject) => {
      const listPossibilidades: IHandlePossibilidades[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [descricao, num_cenario] = line;

          listPossibilidades.push({
            descricao,
            num_cenario: parseInt(num_cenario, 10),
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(listPossibilidades);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandlePossibilidadesService };

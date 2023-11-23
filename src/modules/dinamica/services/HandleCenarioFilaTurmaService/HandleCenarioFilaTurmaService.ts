import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchCenarioFilaTurmaDTO } from "../../dtos/ICreateCenarioFilaTurmaDTO";
import { CenarioFilaTurma } from "../../infra/typeorm/entities/CenarioFilaTurma";
import { ICenarioFilaTurmaRepository } from "../../infra/typeorm/repositories/interfaces/ICenarioFilaTurmaRepository";

interface IHandleCenarioFilaTurma {
  num_cenario: number;
  id_turma: number;
  id_fila: number;
  status: number;
  prioridade: number;
  posicao: number;
}

@injectable()
class HandleCenarioFilaTurmaService {
  constructor(
    @inject("CenarioFilaTurmaRepository")
    private cenarioFilaRepository: ICenarioFilaTurmaRepository
  ) {}

  async create({
    num_cenario,
    id_turma,
    id_fila,
    status,
    prioridade,
    posicao,
  }: IHandleCenarioFilaTurma): Promise<CenarioFilaTurma> {
    const cenarioFilaFounded =
      await this.cenarioFilaRepository.queryByCenarioETurmaEFila(
        num_cenario,
        id_turma,
        id_fila
      );

    if (cenarioFilaFounded) {
      throw new AppError("Já existe um cenário com esta turma e fila!");
    }

    return this.cenarioFilaRepository.create({
      num_cenario,
      id_turma,
      id_fila,
      status,
      prioridade,
      posicao,
    });
  }

  async read(): Promise<CenarioFilaTurma[]> {
    return this.cenarioFilaRepository.listCenarios();
  }

  async update({
    num_cenario,
    id_turma,
    id_fila,
    status,
    prioridade,
    posicao,
  }: IPatchCenarioFilaTurmaDTO): Promise<CenarioFilaTurma> {
    const cenarioFilaFounded =
      await this.cenarioFilaRepository.queryByCenarioETurmaEFila(
        num_cenario,
        id_turma,
        id_fila
      );

    if (!cenarioFilaFounded) {
      throw new AppError("Registro não encontrado!");
    }

    return this.cenarioFilaRepository.updateByCenarioETurmaEFila({
      num_cenario,
      id_turma,
      id_fila,
      status,
      prioridade,
      posicao,
    });
  }

  async delete(
    num_cenario: number,
    id_turma: number,
    id_fila: number
  ): Promise<void> {
    await this.cenarioFilaRepository.deleteByCenarioETurmaEFila(
      num_cenario,
      id_turma,
      id_fila
    );
  }

  async import(file: Express.Multer.File): Promise<void> {
    const cenarioFilas = await this.loadCenarioFilaTurmas(file);

    cenarioFilas.map(async (cenarioFilaToProcess) => {
      const { num_cenario, id_turma, id_fila, status, prioridade, posicao } =
        cenarioFilaToProcess;

      console.log(cenarioFilaToProcess);

      await this.cenarioFilaRepository.create({
        num_cenario,
        id_turma,
        id_fila,
        status,
        prioridade,
        posicao,
      });
    });
  }

  private loadCenarioFilaTurmas(
    file: Express.Multer.File
  ): Promise<IHandleCenarioFilaTurma[]> {
    return new Promise((resolve, reject) => {
      const cenarioFilas: IHandleCenarioFilaTurma[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [num_cenario, id_turma, id_fila, status, prioridade, posicao] =
            line;

          cenarioFilas.push({
            num_cenario: parseInt(num_cenario, 10),
            id_turma: parseInt(id_turma, 10),
            id_fila: parseInt(id_fila, 10),
            status: parseInt(status, 10),
            prioridade: parseInt(prioridade, 10),
            posicao: parseInt(posicao, 10),
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(cenarioFilas);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleCenarioFilaTurmaService };

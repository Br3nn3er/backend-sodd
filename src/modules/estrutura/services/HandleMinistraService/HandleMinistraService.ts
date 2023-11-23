import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { Ministra } from "../../infra/typeorm/entities/Ministra";
import { IMinistraRepository } from "../../infra/typeorm/repositories/interfaces/IMinistraRepository";
import { ISemestresRepository } from "../../infra/typeorm/repositories/interfaces/ISemestresRepository";
import { ITurmasRepository } from "../../infra/typeorm/repositories/interfaces/ITurmasRepository";

interface IRequest {
  siape: string;
  id_turma: string;
}

interface IImportMinistra {
  siape: string;
  codigo_disc: string;
  turma: string;
  ano: number;
  semestre: number;
}

@injectable()
class HandleMinistraService {
  constructor(
    @inject("MinistraRepository")
    private ministraRepository: IMinistraRepository,

    @inject("TurmasRepository")
    private turmaRepository: ITurmasRepository,

    @inject("SemestresRepository")
    private semestresRepository: ISemestresRepository
  ) {}

  async create({ siape, id_turma }: IRequest): Promise<Ministra> {
    const existentMinistra =
      await this.ministraRepository.queryBySiapeAndIdTurma(siape, id_turma);

    if (existentMinistra) {
      throw new AppError("Há um professor ministrando nesta turma!", 403);
    }

    return this.ministraRepository.create({
      siape,
      id_turma,
    });
  }

  async read(): Promise<Ministra[]> {
    const allMinistra = await this.ministraRepository.listAllMinistra();

    allMinistra.forEach((ministra) => {
      // eslint-disable-next-line no-param-reassign
      ministra.siape = ministra.siape ? ministra.siape.trim() : null;
    });

    return allMinistra;
  }

  async readByProfessorAndSemestre(
    siapes: string[],
    semestreId: number
  ): Promise<Ministra[]> {
    const { ano, semestre } = await this.semestresRepository.queryById(
      semestreId
    );
    return this.ministraRepository.listMinistraByProfessorAndSemestre(
      siapes,
      ano,
      semestre
    );
  }

  async readByTurmaAndSemestre(
    turmaIds: number[],
    semestreId: number
  ): Promise<Ministra[]> {
    const { ano, semestre } = await this.semestresRepository.queryById(
      semestreId
    );
    return this.ministraRepository.listByTurmasAndSemestre(
      turmaIds,
      ano,
      semestre
    );
  }

  async delete(siape: string, id_turma: string): Promise<void> {
    await this.ministraRepository.deleteBySiapeAndIdTurma(siape, id_turma);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const ministraLines = await this.loadMinistra(file);

    ministraLines.map(async (ministra) => {
      const { siape, codigo_disc, turma, ano, semestre } = ministra;

      const foundedTurma =
        await this.turmaRepository.queryByCodigoTurmaAnoSemestre(
          codigo_disc,
          turma,
          ano,
          semestre
        );

      if (foundedTurma) {
        const existentMinistra =
          await this.ministraRepository.queryBySiapeAndIdTurma(
            siape,
            foundedTurma.id
          );

        if (!existentMinistra) {
          console.log(ministra);

          await this.ministraRepository.create({
            siape,
            id_turma: foundedTurma.id,
          });
        }
      }
    });
  }

  private loadMinistra(file: Express.Multer.File): Promise<IImportMinistra[]> {
    return new Promise((resolve, reject) => {
      const ministra: IImportMinistra[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [siape, codigo_disc, turma, ano, semestre] = line;

          ministra.push({
            siape,
            codigo_disc,
            turma,
            ano,
            semestre,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(ministra);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleMinistraService };

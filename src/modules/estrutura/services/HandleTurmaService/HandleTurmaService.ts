import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchTurmaDTO } from "../../dtos/ICreateUpdateTurmaDTO";
import { Turma } from "../../infra/typeorm/entities/Turma";
import { ISemestresRepository } from "../../infra/typeorm/repositories/interfaces/ISemestresRepository";
import { ITurmasRepository } from "../../infra/typeorm/repositories/interfaces/ITurmasRepository";

interface IRequest {
  codigo_disc: string;
  turma: string;
  ch: number;
  ano: number;
  semestre: number;
}

interface IImportTurma {
  codigo_disc: string;
  turma: string;
  ch: number;
  ano: number;
  semestre: number;
}

@injectable()
class HandleTurmaService {
  constructor(
    @inject("TurmasRepository")
    private turmasRepository: ITurmasRepository,

    @inject("SemestresRepository")
    private semestresRepository: ISemestresRepository
  ) {}

  async create({
    codigo_disc,
    turma,
    ch,
    ano,
    semestre,
  }: IRequest): Promise<Turma> {
    const existentTurma =
      await this.turmasRepository.queryByCodigoTurmaAnoSemestre(
        codigo_disc,
        turma,
        ano,
        semestre
      );

    if (existentTurma) {
      throw new AppError("Há uma turma com este código!");
    }

    return this.turmasRepository.createTurma({
      codigo_disc,
      turma,
      ch,
      ano,
      semestre,
    });
  }

  async read(semesterId?: number): Promise<Turma[]> {
    const turmas = semesterId
      ? await this.readBySemesterId(semesterId)
      : await this.turmasRepository.listAllTurmas();

    turmas.forEach((turmaToTrim) => {
      // eslint-disable-next-line no-param-reassign
      turmaToTrim.codigo_disc = turmaToTrim.codigo_disc.trim();
      // eslint-disable-next-line no-param-reassign
      turmaToTrim.turma = turmaToTrim.turma.trim();
    });

    return turmas;
  }

  async readBySemesterId(id: number): Promise<Turma[]> {
    const { ano, semestre } = await this.semestresRepository.queryById(id);
    return this.turmasRepository.queryByAnoESemestre(ano, semestre);
  }

  async update({
    id,
    codigo_disc,
    turma,
    ch,
    ano,
    semestre,
  }: IPatchTurmaDTO): Promise<Turma> {
    const existentTurma = await this.turmasRepository.queryById(id);

    if (!existentTurma) {
      throw new AppError("Esta turma não está cadastrada!");
    }

    return this.turmasRepository.updateById({
      id,
      codigo_disc,
      turma,
      ch,
      ano,
      semestre,
    });
  }

  async delete(id: string): Promise<void> {
    await this.turmasRepository.deleteById(id);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const turmas = await this.loadTurmas(file);

    turmas.map(async (turmaToSearch) => {
      const { codigo_disc, turma, ch, ano, semestre } = turmaToSearch;

      const existentCurso =
        await this.turmasRepository.queryByCodigoTurmaAnoSemestre(
          codigo_disc,
          turma,
          ano,
          semestre
        );

      if (!existentCurso) {
        console.log(turmaToSearch);

        await this.turmasRepository.createTurma({
          codigo_disc,
          turma,
          ch,
          ano,
          semestre,
        });
      }
    });
  }

  private loadTurmas(file: Express.Multer.File): Promise<IImportTurma[]> {
    return new Promise((resolve, reject) => {
      const turmas: IImportTurma[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [codigo_disc, turma, ch, ano, semestre] = line;

          turmas.push({
            codigo_disc,
            turma,
            ch,
            ano,
            semestre,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(turmas);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleTurmaService };

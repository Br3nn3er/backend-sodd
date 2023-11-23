import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchCenarioDTO } from "../../dtos/ICreateCenarioDTO";
import { Cenario } from "../../infra/typeorm/entities/Cenario";
import { ICenarioRepository } from "../../infra/typeorm/repositories/interfaces/ICenarioRepository";

interface IHandleCenario {
  descricao_cenario: string;
  ano: number;
  semestre: number;
}

@injectable()
class HandleCenarioService {
  constructor(
    @inject("CenarioRepository")
    private cenarioRepository: ICenarioRepository
  ) {}

  async create({
    descricao_cenario,
    ano,
    semestre,
  }: IHandleCenario): Promise<Cenario> {
    return this.cenarioRepository.create({
      descricao_cenario,
      ano,
      semestre,
    });
  }

  async read(): Promise<Cenario[]> {
    const cenarios = await this.cenarioRepository.listCenarios();

    cenarios.forEach((cenario) => {
      // eslint-disable-next-line no-param-reassign
      cenario.descricao_cenario = cenario.descricao_cenario
        ? cenario.descricao_cenario.trim()
        : null;
    });

    return cenarios;
  }

  async update({
    num_cenario,
    descricao_cenario,
    ano,
    semestre,
  }: IPatchCenarioDTO): Promise<Cenario> {
    const cenarioFounded = await this.cenarioRepository.queryByNumCenario(
      num_cenario
    );

    if (!cenarioFounded) {
      throw new AppError("Cenário não encontrado!", 403);
    }

    return this.cenarioRepository.updateByNumCenario({
      num_cenario,
      descricao_cenario,
      ano,
      semestre,
    });
  }

  async delete(num_cenario: string): Promise<void> {
    await this.cenarioRepository.deleteByNumCenario(num_cenario);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const listCenario = await this.loadCenarios(file);

    listCenario.map(async (cenarioToProcess) => {
      const { descricao_cenario, ano, semestre } = cenarioToProcess;

      console.log(cenarioToProcess);

      await this.cenarioRepository.create({
        descricao_cenario,
        ano,
        semestre,
      });
    });
  }

  private loadCenarios(file: Express.Multer.File): Promise<IHandleCenario[]> {
    return new Promise((resolve, reject) => {
      const listCenarios: IHandleCenario[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [descricao_cenario, ano, semestre] = line;

          listCenarios.push({
            descricao_cenario,
            ano: parseInt(ano, 10),
            semestre: parseInt(semestre, 10),
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(listCenarios);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleCenarioService };

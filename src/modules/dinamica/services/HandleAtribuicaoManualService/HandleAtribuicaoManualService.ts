import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { AtribuicaoManual } from "../../infra/typeorm/entities/AtribuicaoManual";
import { IAtribuicaoManualRepository } from "../../infra/typeorm/repositories/interfaces/IAtribuicaoManualRepository";

interface IHandleAtribuicaoManual {
  num_cenario: number;
  siape: string;
  id_turma: number;
}

@injectable()
class HandleAtribuicaoManualService {
  constructor(
    @inject("AtribuicaoManualRepository")
    private atribuicaoRepository: IAtribuicaoManualRepository
  ) {}

  async create({
    num_cenario,
    siape,
    id_turma,
  }: IHandleAtribuicaoManual): Promise<AtribuicaoManual> {
    const atribuicaoManual =
      await this.atribuicaoRepository.queryByCenarioETurma(
        num_cenario,
        id_turma
      );

    if (atribuicaoManual) {
      throw new AppError("Atribuição já cadastrada!");
    }

    return this.atribuicaoRepository.create({
      num_cenario,
      siape,
      id_turma,
    });
  }

  async read(): Promise<AtribuicaoManual[]> {
    const atribuicoes = await this.atribuicaoRepository.listAllAtribuicoes();

    atribuicoes.forEach((atribuicao) => {
      // eslint-disable-next-line no-param-reassign
      atribuicao.siape = atribuicao.siape ? atribuicao.siape.trim() : null;
    });

    return atribuicoes;
  }

  async delete(num_cenario: number, id_turma: number): Promise<void> {
    await this.atribuicaoRepository.deleteByCenarioETurma(
      num_cenario,
      id_turma
    );
  }

  async import(file: Express.Multer.File): Promise<void> {
    const atribuicoes = await this.loadAtribuicoes(file);

    atribuicoes.map(async (atribuicaoToProcess) => {
      const { num_cenario, siape, id_turma } = atribuicaoToProcess;

      console.log(atribuicaoToProcess);

      await this.atribuicaoRepository.create({
        num_cenario,
        siape,
        id_turma,
      });
    });
  }

  private loadAtribuicoes(
    file: Express.Multer.File
  ): Promise<IHandleAtribuicaoManual[]> {
    return new Promise((resolve, reject) => {
      const atribuicoes: IHandleAtribuicaoManual[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [num_cenario, siape, id_turma] = line;

          atribuicoes.push({
            num_cenario: parseInt(num_cenario, 10),
            siape,
            id_turma: parseInt(id_turma, 10),
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path).then(() => resolve(atribuicoes));
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleAtribuicaoManualService };

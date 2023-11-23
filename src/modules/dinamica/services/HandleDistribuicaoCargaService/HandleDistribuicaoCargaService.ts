import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchDistribuicaoCargaDTO } from "../../dtos/ICreateDistribuicaoCargaDTO";
import { DistribuicaoCarga } from "../../infra/typeorm/entities/DistribuicaoCarga";
import { IDistribuicaoCargaRepository } from "../../infra/typeorm/repositories/interfaces/IDistribuicaoCargaRepository";

interface IHandleDistribuicaoCarga {
  cenario: number;
  siape: string;
  regra: string;
  carga: number;
}

@injectable()
class HandleDistribuicaoCargaService {
  constructor(
    @inject("DistribuicaoCargaRepository")
    private distRepository: IDistribuicaoCargaRepository
  ) {}

  async create({
    cenario,
    siape,
    regra,
    carga,
  }: IHandleDistribuicaoCarga): Promise<DistribuicaoCarga> {
    const existentDist = await this.distRepository.queryByCenarioESiapeERegra(
      cenario,
      siape,
      regra
    );

    if (existentDist) {
      throw new AppError("Distribuicao já cadastrada!");
    }

    return this.distRepository.create({
      cenario,
      siape,
      regra,
      carga,
    });
  }

  async read(): Promise<DistribuicaoCarga[]> {
    const dists = await this.distRepository.listDistribuicoes();

    dists.forEach((dist) => {
      // eslint-disable-next-line no-param-reassign
      dist.siape = dist.siape ? dist.siape.trim() : null;
      // eslint-disable-next-line no-param-reassign
      dist.regra = dist.regra ? dist.regra.trim() : null;
    });

    return dists;
  }

  async update({
    cenario,
    siape,
    regra,
    carga,
  }: IPatchDistribuicaoCargaDTO): Promise<DistribuicaoCarga> {
    const distFounded = await this.distRepository.queryByCenarioESiapeERegra(
      cenario,
      siape,
      regra
    );

    if (!distFounded) {
      throw new AppError("Distribuição não encontrada!", 403);
    }

    return this.distRepository.update({
      cenario,
      siape,
      regra,
      carga,
    });
  }

  async delete(cenario: number, siape: string, regra: string): Promise<void> {
    await this.distRepository.deleteByCenarioESiapeERegra(
      cenario,
      siape,
      regra
    );
  }

  async import(file: Express.Multer.File): Promise<void> {
    const listDistribuicaoCarga = await this.loadDistribuicaoCargas(file);

    listDistribuicaoCarga.map(async (distToProcess) => {
      const { cenario, siape, regra, carga } = distToProcess;

      console.log(distToProcess);

      await this.distRepository.create({
        cenario,
        siape,
        regra,
        carga,
      });
    });
  }

  private loadDistribuicaoCargas(
    file: Express.Multer.File
  ): Promise<IHandleDistribuicaoCarga[]> {
    return new Promise((resolve, reject) => {
      const listDistribuicaoCargas: IHandleDistribuicaoCarga[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [cenario, siape, regra, carga] = line;

          listDistribuicaoCargas.push({
            cenario: parseInt(cenario, 10),
            siape,
            regra,
            carga: parseInt(carga, 10),
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(listDistribuicaoCargas);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleDistribuicaoCargaService };

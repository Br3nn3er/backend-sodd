import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchEtapaDTO } from "../../dtos/ICreateEtapaDTO";
import { Etapa } from "../../infra/typeorm/entities/Etapa";
import { IEtapaRepository } from "../../infra/typeorm/repositories/interfaces/IEtapaRepository";

interface IHandleEtapa {
  codigo: string;
  ativo: boolean;
  descricao: string;
}

@injectable()
class HandleEtapaService {
  constructor(
    @inject("EtapaRepository")
    private etapaRepository: IEtapaRepository
  ) {}

  async create({ codigo, ativo, descricao }: IHandleEtapa): Promise<Etapa> {
    return this.etapaRepository.create({
      codigo,
      ativo,
      descricao,
    });
  }

  async read(): Promise<Etapa[]> {
    return this.etapaRepository.listEtapas();
  }

  async update({
    id,
    codigo,
    ativo,
    descricao,
  }: IPatchEtapaDTO): Promise<Etapa> {
    const etapaFounded = await this.etapaRepository.queryById(id);

    if (!etapaFounded) {
      throw new AppError("Registro de etapa não cadastrado!");
    }

    return this.etapaRepository.updateById({
      id,
      codigo,
      ativo,
      descricao,
    });
  }

  async delete(id: string): Promise<void> {
    await this.etapaRepository.deleteById(id);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const etapas = await this.loadEtapas(file);

    etapas.map(async (etapaToProcess) => {
      const { codigo, ativo, descricao } = etapaToProcess;

      console.log(etapaToProcess);

      await this.etapaRepository.create({
        codigo,
        ativo,
        descricao,
      });
    });
  }

  private loadEtapas(file: Express.Multer.File): Promise<IHandleEtapa[]> {
    return new Promise((resolve, reject) => {
      const etapas: IHandleEtapa[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [codigo, ativo, descricao] = line;

          etapas.push({
            codigo,
            ativo: ativo.toLowerCase() === "true",
            descricao,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(etapas);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleEtapaService };

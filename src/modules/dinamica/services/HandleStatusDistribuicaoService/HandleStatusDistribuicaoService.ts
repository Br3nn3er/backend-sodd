import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchStatusDistribuicaoDTO } from "../../dtos/ICreateStatusDistribuicaoDTO";
import { StatusDistribuicao } from "../../infra/typeorm/entities/StatusDistribuicao";
import { IStatusDistribuicaoRepository } from "../../infra/typeorm/repositories/interfaces/IStatusDistribuicaoRepository";

interface IHandleStatusDistribuicao {
  id: number;
  descricao: string;
}

@injectable()
class HandleStatusDistribuicaoService {
  constructor(
    @inject("StatusDistribuicaoRepository")
    private statusRepository: IStatusDistribuicaoRepository
  ) {}

  async create({
    id,
    descricao,
  }: IHandleStatusDistribuicao): Promise<StatusDistribuicao> {
    return this.statusRepository.create({
      id,
      descricao,
    });
  }

  async read(): Promise<StatusDistribuicao[]> {
    const listStatus = await this.statusRepository.listAllStatus();

    listStatus.forEach((prioridadeToTrim) => {
      // eslint-disable-next-line no-param-reassign
      prioridadeToTrim.descricao = prioridadeToTrim.descricao.trim();
    });

    return listStatus;
  }

  async update({
    codigo,
    id,
    descricao,
  }: IPatchStatusDistribuicaoDTO): Promise<StatusDistribuicao> {
    const statusFounded = await this.statusRepository.queryByCodigo(codigo);

    if (!statusFounded) {
      throw new AppError("Registro de status não cadastrado!");
    }

    return this.statusRepository.updateByCodigo({
      codigo,
      id,
      descricao,
    });
  }

  async delete(codigo: string): Promise<void> {
    await this.statusRepository.deleteByCodigo(codigo);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const listStatus = await this.loadStatus(file);

    listStatus.map(async (statusToProcess) => {
      const { id, descricao } = statusToProcess;

      console.log(statusToProcess);

      await this.statusRepository.create({
        id,
        descricao,
      });
    });
  }

  private loadStatus(
    file: Express.Multer.File
  ): Promise<IHandleStatusDistribuicao[]> {
    return new Promise((resolve, reject) => {
      const listStatus: IHandleStatusDistribuicao[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [id, descricao] = line;

          listStatus.push({
            id: parseInt(id, 10),
            descricao,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(listStatus);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleStatusDistribuicaoService };

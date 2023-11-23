import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchCargaDocenteDTO } from "../../dtos/ICreateUpdateCargaDocenteDTO";
import { CargaDocente } from "../../infra/typeorm/entities/CargaDocente";
import { ICargaDocentesRepository } from "../../infra/typeorm/repositories/interfaces/ICargaDocentesRepository";

interface IRequest {
  siape: string;
  carga_atual: number;
  ano: number;
  semestre: number;
}

interface IImportCarga {
  siape: string;
  carga_atual: number;
  ano: number;
  semestre: number;
}

@injectable()
class HandleCargaDocenteService {
  constructor(
    @inject("CargaDocentesRepository")
    private cargasRepository: ICargaDocentesRepository
  ) {}

  async create({
    siape,
    carga_atual,
    ano,
    semestre,
  }: IRequest): Promise<CargaDocente> {
    const cargaExistent = await this.cargasRepository.queryBySiape(siape);

    if (cargaExistent) {
      throw new AppError("Já existe uma carga para este siape!");
    }

    return this.cargasRepository.createCarga({
      siape,
      carga_atual,
      ano,
      semestre,
    });
  }

  async read(): Promise<CargaDocente[]> {
    const cargas = await this.cargasRepository.listAllCargas();

    cargas.forEach((carga) => {
      // eslint-disable-next-line no-param-reassign
      carga.siape = carga.siape.trim();
    });

    return cargas;
  }

  async update({
    siape,
    carga_atual,
    ano,
    semestre,
  }: IPatchCargaDocenteDTO): Promise<CargaDocente> {
    const cargaExistent = await this.cargasRepository.queryBySiape(siape);

    if (!cargaExistent) {
      throw new AppError("Não há uma carga para este siape!");
    }

    return this.cargasRepository.updateBySiape({
      siape,
      carga_atual,
      ano,
      semestre,
    });
  }

  async deleteBySiape(siape: string): Promise<void> {
    await this.cargasRepository.deleteBySiape(siape);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const cargas = await this.loadCargas(file);

    cargas.map(async (carga) => {
      const { siape, carga_atual, ano, semestre } = carga;

      const existentCarga = await this.cargasRepository.queryBySiape(siape);

      if (!existentCarga) {
        console.log(carga);

        await this.cargasRepository.createCarga({
          siape,
          carga_atual,
          ano,
          semestre,
        });
      }
    });
  }

  private loadCargas(file: Express.Multer.File): Promise<IImportCarga[]> {
    return new Promise((resolve, reject) => {
      const cargas: IImportCarga[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [siape, carga_atual, ano, semestre] = line;

          cargas.push({
            siape,
            carga_atual,
            ano,
            semestre,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path).then((r) => resolve(cargas));
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleCargaDocenteService };

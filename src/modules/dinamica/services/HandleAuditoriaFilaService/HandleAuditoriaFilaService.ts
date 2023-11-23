import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchAuditoriaFilaDTO } from "../../dtos/ICreateAuditoriaFilaDTO";
import { AuditoriaFila } from "../../infra/typeorm/entities/AuditoriaFila";
import { IAuditoriaFilaRepository } from "../../infra/typeorm/repositories/interfaces/IAuditoriaFilaRepository";

interface IHandleAuditoriaFila {
  siape: string;
  codigo_disc: string;
  pos: number;
  prioridade: number;
  qte_ministrada: number;
  qte_maximo: number;
  ano: number;
  semestre: number;
  status: number;
  periodo_preferencial: boolean;
  comando: string;
  stamp: Date;
}

@injectable()
class HandleAuditoriaFilaService {
  constructor(
    @inject("AuditoriaFilaRepository")
    private auditoriaFilaRepository: IAuditoriaFilaRepository
  ) {}

  async create({
    siape,
    codigo_disc,
    pos,
    prioridade,
    qte_ministrada,
    qte_maximo,
    ano,
    semestre,
    status,
    periodo_preferencial,
    comando,
    stamp,
  }: IHandleAuditoriaFila): Promise<AuditoriaFila> {
    return this.auditoriaFilaRepository.create({
      siape,
      codigo_disc,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      ano,
      semestre,
      status,
      periodo_preferencial,
      comando,
      stamp,
    });
  }

  async read(): Promise<AuditoriaFila[]> {
    const auditorias = await this.auditoriaFilaRepository.listAllAuditorias();

    auditorias.forEach((auditoriaToTrim) => {
      // eslint-disable-next-line no-param-reassign
      auditoriaToTrim.siape = auditoriaToTrim.siape.trim();
      // eslint-disable-next-line no-param-reassign
      auditoriaToTrim.codigo_disc = auditoriaToTrim.codigo_disc.trim();
    });

    return auditorias;
  }

  async update({
    id,
    siape,
    codigo_disc,
    pos,
    prioridade,
    qte_ministrada,
    qte_maximo,
    ano,
    semestre,
    status,
    periodo_preferencial,
    comando,
    stamp,
  }: IPatchAuditoriaFilaDTO): Promise<AuditoriaFila> {
    const existentAuditoria = await this.auditoriaFilaRepository.queryById(id);

    if (!existentAuditoria) {
      throw new AppError("Auditoria não cadastrada!");
    }

    return this.auditoriaFilaRepository.updateById({
      id,
      siape,
      codigo_disc,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      ano,
      semestre,
      status,
      periodo_preferencial,
      comando,
      stamp,
    });
  }

  async delete(id: string): Promise<void> {
    await this.auditoriaFilaRepository.deleteById(id);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const auditorias = await this.loadAuditorias(file);

    auditorias.map(async (auditoriaToProcess) => {
      const {
        siape,
        codigo_disc,
        pos,
        prioridade,
        qte_ministrada,
        qte_maximo,
        ano,
        semestre,
        status,
        periodo_preferencial,
        comando,
        stamp,
      } = auditoriaToProcess;

      console.log(auditoriaToProcess);

      await this.auditoriaFilaRepository.create({
        siape,
        codigo_disc,
        pos,
        prioridade,
        qte_ministrada,
        qte_maximo,
        ano,
        semestre,
        status,
        periodo_preferencial,
        comando,
        stamp,
      });
    });
  }

  private loadAuditorias(
    file: Express.Multer.File
  ): Promise<IHandleAuditoriaFila[]> {
    return new Promise((resolve, reject) => {
      const auditorias: IHandleAuditoriaFila[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [
            siape,
            codigo_disc,
            pos,
            prioridade,
            qte_ministrada,
            qte_maximo,
            ano,
            semestre,
            status,
            periodo_preferencial,
            comando,
            stamp,
          ] = line;

          auditorias.push({
            siape,
            codigo_disc,
            pos: parseInt(pos, 10),
            prioridade: parseInt(prioridade, 10),
            qte_ministrada: parseInt(qte_ministrada, 10),
            qte_maximo: parseInt(qte_maximo, 10),
            ano: parseInt(ano, 10),
            semestre: parseInt(semestre, 10),
            status: parseInt(status, 10),
            periodo_preferencial: periodo_preferencial.toLowerCase() === "true",
            comando,
            stamp,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(auditorias);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleAuditoriaFilaService };

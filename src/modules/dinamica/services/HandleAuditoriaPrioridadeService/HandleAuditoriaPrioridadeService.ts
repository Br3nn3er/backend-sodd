import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchAuditoriaPrioridadeDTO } from "../../dtos/ICreateAuditoriaPrioridadeDTO";
import { AuditoriaPrioridade } from "../../infra/typeorm/entities/AuditoriaPrioridade";
import { IAuditoriaPrioridadeRepository } from "../../infra/typeorm/repositories/interfaces/IAuditoriaPrioridadeRepository";

interface IHandleAuditoriaPrioridade {
  siape: string;
  codigo_disc: string;
  prioridade_antiga: number;
  prioridade_nova: number;
  stamp: Date;
}

@injectable()
class HandleAuditoriaPrioridadeService {
  constructor(
    @inject("AuditoriaPrioridadeRepository")
    private auditoriaPrioridade: IAuditoriaPrioridadeRepository
  ) {}

  async create({
    siape,
    codigo_disc,
    prioridade_antiga,
    prioridade_nova,
    stamp,
  }: IHandleAuditoriaPrioridade): Promise<AuditoriaPrioridade> {
    return this.auditoriaPrioridade.create({
      siape,
      codigo_disc,
      prioridade_antiga,
      prioridade_nova,
      stamp,
    });
  }

  async read(): Promise<AuditoriaPrioridade[]> {
    const auditorias = await this.auditoriaPrioridade.listAllAuditorias();

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
    prioridade_antiga,
    prioridade_nova,
    stamp,
  }: IPatchAuditoriaPrioridadeDTO): Promise<AuditoriaPrioridade> {
    const auditoriaFounded = await this.auditoriaPrioridade.queryById(id);

    if (!auditoriaFounded) {
      throw new AppError("Auditoria não cadastrada!");
    }

    return this.auditoriaPrioridade.update({
      id,
      siape,
      codigo_disc,
      prioridade_antiga,
      prioridade_nova,
      stamp,
    });
  }

  async delete(id: string): Promise<void> {
    await this.auditoriaPrioridade.deleteById(id);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const auditorias = await this.loadAuditorias(file);

    auditorias.map(async (auditoriaToProcess) => {
      const { siape, codigo_disc, prioridade_antiga, prioridade_nova, stamp } =
        auditoriaToProcess;

      console.log(auditoriaToProcess);

      await this.auditoriaPrioridade.create({
        siape,
        codigo_disc,
        prioridade_antiga,
        prioridade_nova,
        stamp,
      });
    });
  }

  private loadAuditorias(
    file: Express.Multer.File
  ): Promise<IHandleAuditoriaPrioridade[]> {
    return new Promise((resolve, reject) => {
      const auditorias: IHandleAuditoriaPrioridade[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [
            siape,
            codigo_disc,
            prioridade_antiga,
            prioridade_nova,
            stamp,
          ] = line;

          auditorias.push({
            siape,
            codigo_disc,
            prioridade_antiga: parseInt(prioridade_antiga, 10),
            prioridade_nova: parseInt(prioridade_nova, 10),
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

export { HandleAuditoriaPrioridadeService };

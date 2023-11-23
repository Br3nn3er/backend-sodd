import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchAuditoriaFilaNewDTO } from "../../dtos/ICreateAuditoriaFilaNewDTO";
import { AuditoriaFilaNew } from "../../infra/typeorm/entities/AuditoriaFilaNew";
import { IAuditoriaFilaNewRepository } from "../../infra/typeorm/repositories/interfaces/IAuditoriaFilaNewRepository";

interface IHandleAuditoriaFilaNew {
  id_turma: number;
  id_fila: number;
  prioridade_old: number;
  prioridade_new: number;
  stamp: Date;
}

@injectable()
class HandleAuditoriaFilaNewService {
  constructor(
    @inject("AuditoriaFilaNewRepository")
    private auditoriaFilaNewRepository: IAuditoriaFilaNewRepository
  ) {}

  async create({
    id_turma,
    id_fila,
    prioridade_old,
    prioridade_new,
    stamp,
  }: IHandleAuditoriaFilaNew): Promise<AuditoriaFilaNew> {
    return this.auditoriaFilaNewRepository.create({
      id_turma,
      id_fila,
      prioridade_old,
      prioridade_new,
      stamp,
    });
  }

  async read(): Promise<AuditoriaFilaNew[]> {
    return this.auditoriaFilaNewRepository.listAllAuditoriaNew();
  }

  async update({
    id,
    id_turma,
    id_fila,
    prioridade_old,
    prioridade_new,
    stamp,
  }: IPatchAuditoriaFilaNewDTO): Promise<AuditoriaFilaNew> {
    const existentAuditoriaNew =
      await this.auditoriaFilaNewRepository.queryById(id);

    if (!existentAuditoriaNew) {
      throw new AppError("Auditoria não cadastrada!");
    }

    return this.auditoriaFilaNewRepository.updateById({
      id,
      id_turma,
      id_fila,
      prioridade_old,
      prioridade_new,
      stamp,
    });
  }

  async delete(id: string): Promise<void> {
    await this.auditoriaFilaNewRepository.deleteById(id);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const auditoriasNew = await this.loadAuditorias(file);

    auditoriasNew.map(async (auditoriaNewToProcess) => {
      const { id_turma, id_fila, prioridade_old, prioridade_new, stamp } =
        auditoriaNewToProcess;

      console.log(auditoriaNewToProcess);

      await this.auditoriaFilaNewRepository.create({
        id_turma,
        id_fila,
        prioridade_old,
        prioridade_new,
        stamp,
      });
    });
  }

  private loadAuditorias(
    file: Express.Multer.File
  ): Promise<IHandleAuditoriaFilaNew[]> {
    return new Promise((resolve, reject) => {
      const auditorias: IHandleAuditoriaFilaNew[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [id_turma, id_fila, prioridade_old, prioridade_new, stamp] =
            line;

          auditorias.push({
            id_turma: parseInt(id_turma, 10),
            id_fila: parseInt(id_fila, 10),
            prioridade_old: parseInt(prioridade_old, 10),
            prioridade_new: parseInt(prioridade_new, 10),
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

export { HandleAuditoriaFilaNewService };

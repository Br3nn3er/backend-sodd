import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ISemestresRepository } from "../../../estrutura/infra/typeorm/repositories/interfaces/ISemestresRepository";
import { IPatchFilaDTO } from "../../dtos/ICreateFilaDTO";
import { Fila } from "../../infra/typeorm/entities/Fila";
import { IFilaRepository } from "../../infra/typeorm/repositories/interfaces/IFilaRepository";

interface IHandleFila {
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
}

@injectable()
class HandleFilaService {
  constructor(
    @inject("FilaRepository")
    private filaRepository: IFilaRepository,
    @inject("SemestresRepository")
    private semestresRepository: ISemestresRepository
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
  }: IHandleFila): Promise<Fila> {
    const filaFounded_1 =
      await this.filaRepository.queryByDiscEPosEAnoESemestre(
        codigo_disc,
        pos,
        ano,
        semestre
      );

    const filaFounded_2 =
      await this.filaRepository.queryBySiapeEDiscEAnoESemestre(
        siape,
        codigo_disc,
        ano,
        semestre
      );

    if (filaFounded_1 || filaFounded_2) {
      throw new AppError("Há uma fila com esta configuração já cadastrada!");
    }

    return this.filaRepository.create({
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
    });
  }

  async read(): Promise<Fila[]> {
    const filas = await this.filaRepository.listFilas();

    filas.forEach((fila) => {
      // eslint-disable-next-line no-param-reassign
      fila.siape = fila.siape.trim();
      // eslint-disable-next-line no-param-reassign
      fila.codigo_disc = fila.codigo_disc.trim();
    });

    return filas;
  }

  async readByDisciplinaESemestre(
    codigo_disc: string,
    semestreId: number
  ): Promise<Fila[]> {
    const { ano, semestre } = await this.semestresRepository.queryById(
      semestreId
    );

    const filas = await this.filaRepository.queryByDiscEAnoESemestre(
      codigo_disc,
      ano,
      semestre
    );

    return filas.map((fila) => ({
      ...fila,
      siape: fila.siape.trim(),
      codigo_disc: fila.codigo_disc.trim(),
    }));
  }

  async readByProfessorESemestre(
    siape: string,
    semestreId: number
  ): Promise<Fila[]> {
    const { ano, semestre } = await this.semestresRepository.queryById(
      semestreId
    );

    const filas = await this.filaRepository.queryBySIAPEEAnoESemestre(
      siape,
      ano,
      semestre
    );

    return filas.map((fila) => ({
      ...fila,
      siape: fila.siape.trim(),
      codigo_disc: fila.codigo_disc.trim(),
    }));
  }

  async readByProfessor(siape: string): Promise<Fila[]> {
    return this.filaRepository.queryBySiape(siape);
  }

  readByTurma(turma: number): Promise<Fila[]> {
    return this.filaRepository.queryByTurma(turma);
  }

  async readBySemestreEProfessor(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]> {
    return this.filaRepository.queryBySiapeEAnoESemestre(siape, ano, semestre);
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
  }: IPatchFilaDTO): Promise<Fila> {
    const filaFounded = await this.filaRepository.queryById(id);

    if (!filaFounded) {
      throw new AppError("Fila não encontrada!");
    }

    return this.filaRepository.updateById({
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
    });
  }

  async delete(id: number): Promise<void> {
    await this.filaRepository.deleteById(id);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const filas = await this.loadFilas(file);

    filas.map(async (fila) => {
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
      } = fila;

      console.log(fila);

      await this.filaRepository.create({
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
      });
    });
  }

  private loadFilas(file: Express.Multer.File): Promise<IHandleFila[]> {
    return new Promise((resolve, reject) => {
      const filas: IHandleFila[] = [];

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
          ] = line;

          filas.push({
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
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(filas);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleFilaService };

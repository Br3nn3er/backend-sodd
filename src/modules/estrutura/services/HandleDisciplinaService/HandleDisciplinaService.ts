import csvParse from "csv-parse";
import fs from "fs";
import {inject, injectable} from "tsyringe";

import {AppError} from "../../../../shared/errors/AppError";
import {IPatchDisciplinaDTO} from "../../dtos/ICreateUpdateDisciplinaDTO";
import {Disciplina} from "../../infra/typeorm/entities/Disciplina";
import {IDisciplinasRepository} from "../../infra/typeorm/repositories/interfaces/IDisciplinasRepository";

interface IRequest {
  codigo: string;
  nome: string;
  ch_teorica: number;
  ch_pratica: number;
  ch_total: number;
  curso: string;
  temfila: boolean;
  periodo: number;
  cod_antigo: string;
}

interface IImportDisciplina {
  codigo: string;
  nome: string;
  ch_teorica: number;
  ch_pratica: number;
  ch_total: number;
  curso: string;
  temfila: boolean;
  periodo: number;
  cod_antigo: string;
}

@injectable()
class HandleDisciplinaService {
  constructor(
    @inject("DisciplinasRepository")
    private disciplinasRepository: IDisciplinasRepository
  ) {}

  async create({
    codigo,
    nome,
    ch_teorica,
    ch_pratica,
    ch_total,
    curso,
    temfila,
    periodo,
    cod_antigo,
  }: IRequest): Promise<Disciplina> {
    const existentDisciplina = await this.disciplinasRepository.queryByCodigo(
      codigo
    );

    if (existentDisciplina) {
      throw new AppError("Há uma disciplina cadastrada com este codigo!", 403);
    }

    return this.disciplinasRepository.createDisciplina({
      codigo,
      nome,
      ch_teorica,
      ch_pratica,
      ch_total,
      curso,
      temfila,
      periodo,
      cod_antigo,
    });
  }

  async read(): Promise<Disciplina[]> {
    const disciplinas = await this.disciplinasRepository.listAllDisciplinas();

    disciplinas.forEach((disciplina) => {
      // eslint-disable-next-line no-param-reassign
      disciplina.codigo = disciplina.codigo ? disciplina.codigo.trim() : null;
      // eslint-disable-next-line no-param-reassign
      disciplina.curso = disciplina.curso ? disciplina.curso.trim() : null;
      // eslint-disable-next-line no-param-reassign
      disciplina.cod_antigo = disciplina.cod_antigo
        ? disciplina.cod_antigo.trim()
        : null;
    });

    return disciplinas;
  }

  async readByCodigo(codigo: string): Promise<Disciplina> {
    const discipline = await this.disciplinasRepository.queryByCodigo(codigo);
    // eslint-disable-next-line no-param-reassign
    discipline.codigo = discipline.codigo ? discipline.codigo.trim() : null;
    // eslint-disable-next-line no-param-reassign
    discipline.curso = discipline.curso ? discipline.curso.trim() : null;
    // eslint-disable-next-line no-param-reassign
    discipline.cod_antigo = discipline.cod_antigo
      ? discipline.cod_antigo.trim()
      : null;

    return discipline;
  }

  async readBySiapeEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Disciplina[]> {
    // discipline.forEach((disciplina) => {
    //   // eslint-disable-next-line no-param-reassign
    //   disciplina.codigo = disciplina.codigo ? disciplina.codigo.trim() : null;
    //   // eslint-disable-next-line no-param-reassign
    //   disciplina.curso = disciplina.curso ? disciplina.curso.trim() : null;
    //   // eslint-disable-next-line no-param-reassign
    //   disciplina.cod_antigo = disciplina.cod_antigo
    //     ? disciplina.cod_antigo.trim()
    //     : null;
    // });

    return await this.disciplinasRepository.queryBySiapeEAnoESemestre(
      siape,
      ano,
      semestre
    );
  }

  async update({
    codigo,
    nome,
    ch_teorica,
    ch_pratica,
    ch_total,
    curso,
    temfila,
    periodo,
  }: IPatchDisciplinaDTO): Promise<Disciplina> {
    const disciplinaExistent = await this.disciplinasRepository.queryByCodigo(
      codigo
    );

    if (!disciplinaExistent) {
      throw new AppError("Disciplina não cadastrada!");
    }

    return this.disciplinasRepository.updateByCodigo({
      codigo,
      nome,
      ch_teorica,
      ch_pratica,
      ch_total,
      curso,
      temfila,
      periodo,
    });
  }

  async delete(codigo: string): Promise<void> {
    await this.disciplinasRepository.deleteByCodigo(codigo);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const disciplinas = await this.loadDisciplinas(file);

    disciplinas.map(async (disciplina) => {
      const {
        codigo,
        nome,
        ch_teorica,
        ch_pratica,
        ch_total,
        curso,
        temfila,
        periodo,
        cod_antigo,
      } = disciplina;

      const existentDisciplina = await this.disciplinasRepository.queryByCodigo(
        codigo
      );

      if (!existentDisciplina) {
        console.log(disciplina);

        await this.disciplinasRepository.createDisciplina({
          codigo,
          nome,
          ch_teorica,
          ch_pratica,
          ch_total,
          curso,
          temfila,
          periodo,
          cod_antigo,
        });
      }
    });
  }

  private loadDisciplinas(
    file: Express.Multer.File
  ): Promise<IImportDisciplina[]> {
    return new Promise((resolve, reject) => {
      const disciplinas: IImportDisciplina[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [
            codigo,
            nome,
            ch_teorica,
            ch_pratica,
            ch_total,
            curso,
            temfila,
            periodo,
            cod_antigo,
          ] = line;

          disciplinas.push({
            codigo,
            nome,
            ch_teorica,
            ch_pratica,
            ch_total,
            curso,
            temfila: temfila.toLowerCase() === "true",
            periodo,
            cod_antigo: cod_antigo === "" ? null : cod_antigo,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(disciplinas);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleDisciplinaService };

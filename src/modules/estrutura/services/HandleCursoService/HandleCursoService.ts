import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchCursosDTO } from "../../dtos/ICreateUpdateCursosDTO";
import { Curso } from "../../infra/typeorm/entities/Curso";
import { ICursosRepository } from "../../infra/typeorm/repositories/interfaces/ICursosRepository";

interface IRequest {
  codigo: string;
  nome: string;
  unidade: string;
  campus: string;
  permitir_choque_periodo: boolean;
  permitir_choque_horario: boolean;
}

interface IImportCurso {
  codigo: string;
  nome: string;
  unidade: string;
  campus: string;
  permitir_choque_periodo: boolean;
  permitir_choque_horario: boolean;
}

@injectable()
class HandleCursoService {
  constructor(
    @inject("CursosRepository")
    private cursosRepository: ICursosRepository
  ) {}

  async create({
    codigo,
    nome,
    unidade,
    campus,
    permitir_choque_periodo,
    permitir_choque_horario,
  }: IRequest): Promise<Curso> {
    const existentCurso = await this.cursosRepository.queryByCodigo(codigo);

    if (existentCurso) {
      throw new AppError("Há um curso cadastrado com este codigo!");
    }

    return this.cursosRepository.createCurso({
      codigo,
      nome,
      unidade,
      campus,
      permitir_choque_periodo,
      permitir_choque_horario,
    });
  }

  async read(): Promise<Curso[]> {
    const cursos = await this.cursosRepository.listAllCursos();

    cursos.forEach((curso) => {
      // eslint-disable-next-line no-param-reassign
      curso.codigo = curso.codigo.trim();
    });

    return cursos;
  }

  async readByCodigo(codigo: string): Promise<Curso> {
    const course = await this.cursosRepository.queryByCodigo(codigo);
    course.codigo = course.codigo.trim();

    return course;
  }

  async update({
    codigo,
    nome,
    unidade,
    campus,
    permitir_choque_periodo,
    permitir_choque_horario,
  }: IPatchCursosDTO): Promise<Curso> {
    const cursoExistent = await this.cursosRepository.queryByCodigo(codigo);

    if (!cursoExistent) {
      throw new AppError("Curso não existente!");
    }

    return this.cursosRepository.update({
      codigo,
      nome,
      unidade,
      campus,
      permitir_choque_periodo,
      permitir_choque_horario,
    });
  }

  async delete(codigo: string): Promise<void> {
    await this.cursosRepository.deleteByCodigo(codigo);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const cursos = await this.loadCursos(file);

    cursos.map(async (curso) => {
      const {
        codigo,
        nome,
        unidade,
        campus,
        permitir_choque_periodo,
        permitir_choque_horario,
      } = curso;

      const existentCurso = await this.cursosRepository.queryByCodigo(codigo);

      if (!existentCurso) {
        console.log(curso);

        await this.cursosRepository.createCurso({
          codigo,
          nome,
          unidade,
          campus,
          permitir_choque_periodo,
          permitir_choque_horario,
        });
      }
    });
  }

  private loadCursos(file: Express.Multer.File): Promise<IImportCurso[]> {
    return new Promise((resolve, reject) => {
      const cursos: IImportCurso[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [
            codigo,
            nome,
            unidade,
            campus,
            permitir_choque_periodo,
            permitir_choque_horario,
          ] = line;

          cursos.push({
            codigo,
            nome,
            unidade,
            campus,
            permitir_choque_periodo:
              permitir_choque_periodo.toLowerCase() === "true",
            permitir_choque_horario:
              permitir_choque_horario.toLowerCase() === "true",
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path).then(() => resolve(cursos));
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleCursoService };

import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IPatchHorarioDTO } from "../../dtos/ICreateUpdateHorarioDTO";
import { Horario } from "../../infra/typeorm/entities/Horario";
import { IHorariosRepository } from "../../infra/typeorm/repositories/interfaces/IHorariosRepository";

interface IRequest {
  letra: string;
  hora_inicio: string;
  hora_fim: string;
  turno: string;
}

interface IImportHorario {
  letra: string;
  hora_inicio: string;
  hora_fim: string;
  turno: string;
}

@injectable()
class HandleHorarioService {
  constructor(
    @inject("HorariosRepository")
    private horariosRepository: IHorariosRepository
  ) {}

  async create({
    letra,
    hora_inicio,
    hora_fim,
    turno,
  }: IRequest): Promise<Horario> {
    const existentHorario = await this.horariosRepository.queryByLetra(letra);

    if (existentHorario) {
      throw new AppError("Há um horário cadastrado com este codigo!", 403);
    }

    return this.horariosRepository.createHorario({
      letra,
      hora_inicio,
      hora_fim,
      turno,
    });
  }

  async read(): Promise<Horario[]> {
    return this.horariosRepository.listAllHorarios();
  }

  async update({
    letra,
    hora_inicio,
    hora_fim,
    turno,
  }: IPatchHorarioDTO): Promise<Horario> {
    const horario = await this.horariosRepository.queryByLetra(letra);

    if (!horario) {
      throw new AppError("Horário não cadastrado!");
    }

    return this.horariosRepository.updateHorarioByLetra({
      letra,
      hora_inicio,
      hora_fim,
      turno,
    });
  }

  async delete(letra: string): Promise<void> {
    await this.horariosRepository.deleteByLetra(letra);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const horarios = await this.loadHorarios(file);

    horarios.map(async (horario) => {
      const { letra, hora_inicio, hora_fim, turno } = horario;

      const existentHorario = await this.horariosRepository.queryByLetra(letra);

      if (!existentHorario) {
        console.log(horario);

        await this.horariosRepository.createHorario({
          letra,
          hora_inicio,
          hora_fim,
          turno,
        });
      }
    });
  }

  private loadHorarios(file: Express.Multer.File): Promise<IImportHorario[]> {
    return new Promise((resolve, reject) => {
      const horarios: IImportHorario[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [letra, hora_inicio, hora_fim, turno] = line;

          horarios.push({
            letra,
            hora_inicio,
            hora_fim,
            turno,
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(horarios);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleHorarioService };

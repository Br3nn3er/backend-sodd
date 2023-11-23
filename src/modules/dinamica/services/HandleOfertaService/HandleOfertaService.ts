import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ISemestresRepository } from "../../../estrutura/infra/typeorm/repositories/interfaces/ISemestresRepository";
import { Oferta } from "../../infra/typeorm/entities/Oferta";
import { IOfertaRepository } from "../../infra/typeorm/repositories/interfaces/IOfertaRepository";

interface IHandleOferta {
  dia: string;
  letra: string;
  id_turma: number;
}

@injectable()
class HandleOfertaService {
  constructor(
    @inject("OfertaRepository")
    private ofertaRepository: IOfertaRepository,
    @inject("SemestresRepository")
    private semestresRepository: ISemestresRepository
  ) {}

  async create({ dia, letra, id_turma }: IHandleOferta): Promise<Oferta> {
    const ofertaFounded = await this.ofertaRepository.queryByDiaELetraETurma(
      dia,
      letra,
      id_turma
    );

    if (ofertaFounded) {
      throw new AppError("Já existe uma oferta com esta configuração!");
    }

    return this.ofertaRepository.create({ dia, letra, id_turma });
  }

  async read(): Promise<Oferta[]> {
    const ofertas = await this.ofertaRepository.listOfertas();

    ofertas.forEach((oferta) => {
      // eslint-disable-next-line no-param-reassign
      oferta.dia = oferta.dia.trim();
      // eslint-disable-next-line no-param-reassign
      oferta.letra = oferta.letra.trim();
    });

    return ofertas;
  }

  async readByTurmaIdAndSemestreId(
    turmaId: number,
    semestreId: number
  ): Promise<Oferta[]> {
    const { ano, semestre } = await this.semestresRepository.queryById(
      semestreId
    );
    return this.ofertaRepository.listByTurmaIdAndSemestreAndAno(
      turmaId,
      ano,
      semestre
    );
  }

  async delete(id: string): Promise<void> {
    await this.ofertaRepository.delete(id);
  }

  async import(file: Express.Multer.File): Promise<void> {
    const listPossibilidades = await this.loadOfertas(file);

    listPossibilidades.map(async (ofertaToProcess) => {
      const { dia, letra, id_turma } = ofertaToProcess;

      console.log(ofertaToProcess);

      await this.ofertaRepository.create({
        dia,
        letra,
        id_turma,
      });
    });
  }

  private loadOfertas(file: Express.Multer.File): Promise<IHandleOferta[]> {
    return new Promise((resolve, reject) => {
      const ofertas: IHandleOferta[] = [];

      const stream = fs.createReadStream(file.path);

      const parseFile = csvParse.parse();

      stream.pipe(parseFile);

      parseFile
        .on("data", async (line) => {
          const [dia, letra, id_turma] = line;

          ofertas.push({
            dia,
            letra,
            id_turma: parseInt(id_turma, 10),
          });
        })
        .on("end", () => {
          fs.promises.unlink(file.path);
          resolve(ofertas);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}

export { HandleOfertaService };

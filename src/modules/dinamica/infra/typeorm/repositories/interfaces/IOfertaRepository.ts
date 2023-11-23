import { ICreateOfertaDTO } from "../../../../dtos/ICreateOfertaDTO";
import { Oferta } from "../../entities/Oferta";

interface IOfertaRepository {
  create(data: ICreateOfertaDTO): Promise<Oferta>;
  listOfertas(): Promise<Oferta[]>;
  listByTurmaIdAndSemestreAndAno(
    turmaId: number,
    ano: number,
    semestre: number
  ): Promise<Oferta[]>;
  queryById(id: string): Promise<Oferta>;
  queryByDiaELetraETurma(
    dia: string,
    letra: string,
    id_turma: number
  ): Promise<Oferta>;
  delete(id: string): Promise<void>;
}

export { IOfertaRepository };

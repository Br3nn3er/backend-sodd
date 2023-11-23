import {Turma} from "../../../../../estrutura/infra/typeorm/entities/Turma";
import {ICreateOfertaDTO} from "../../../../dtos/ICreateOfertaDTO";
import {Oferta} from "../../entities/Oferta";
import {IOfertaRepository} from "../interfaces/IOfertaRepository";

class OfertaRepositoryTestMock implements IOfertaRepository {
  private ofertas: Oferta[] = [];
  private turmas: Turma[] = [];
  private count = 0;

  async create({ dia, letra, id_turma }: ICreateOfertaDTO): Promise<Oferta> {
    const oferta = new Oferta();

    this.count += 1;

    Object.assign(oferta, {
      id: this.count.toString(),
      dia,
      letra,
      id_turma,
    });

    this.ofertas.push(oferta);

    return oferta;
  }

  async listOfertas(): Promise<Oferta[]> {
    return this.ofertas;
  }

  async listByTurmaIdAndSemestreAndAno(
    turmaId: number,
    ano: number,
    semestre: number
  ): Promise<Oferta[]> {
    const ofertas = this.ofertas.find((oferta) => oferta.id_turma === turmaId);
    const turmas = this.turmas.find(
      (turma) => turma.ano === ano && turma.semestre === semestre
    );

    return ofertas.id_turma.toString() === turmas.id ? [ofertas] : [];
  }

  async queryById(id: string): Promise<Oferta> {
    return this.ofertas.find((oferta) => oferta.id === id);
  }

  async queryByDiaELetraETurma(
    dia: string,
    letra: string,
    id_turma: number
  ): Promise<Oferta> {
    return this.ofertas.find(
      (oferta) =>
        oferta.dia === dia &&
        oferta.letra === letra &&
        oferta.id_turma === id_turma
    );
  }

  async delete(id: string): Promise<void> {
    const ofertaIndex = this.ofertas.findIndex((oferta) => oferta.id === id);

    if (ofertaIndex > -1) {
      this.ofertas.splice(ofertaIndex, 1);
    }
  }
}

export { OfertaRepositoryTestMock };

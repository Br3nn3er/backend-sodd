import {ICreateFilaTurmaDTO, IPatchFilaTurmaDTO,} from "../../../../dtos/ICreateFilaTurmaDTO";
import {FilaTurma} from "../../entities/FilaTurma";
import {IFilaTurmaRepository} from "../interfaces/IFilaTurmaRepository";

class FilaTurmaRepositoryTestMock implements IFilaTurmaRepository {
  private listFilasTurma: FilaTurma[] = [];

  async create({
    siape,
    id_turma,
    codigo_disc,
    turma,
    pos,
    prioridade,
    qte_ministrada,
    status,
    ch,
    id,
    periodo_preferencial,
  }: ICreateFilaTurmaDTO): Promise<FilaTurma> {
    const fila = new FilaTurma();

    Object.assign(fila, {
      siape,
      id_turma,
      codigo_disc,
      turma,
      pos,
      prioridade,
      qte_ministrada,
      status,
      ch,
      id,
      periodo_preferencial,
    });

    this.listFilasTurma.push(fila);

    return fila;
  }

  async listFilas(): Promise<FilaTurma[]> {
    return this.listFilasTurma;
  }

  async queryById(id: number): Promise<FilaTurma> {
    return this.listFilasTurma.find((fila) => fila.id === id);
  }

  async queryBySiape(siape: string): Promise<FilaTurma[]> {
    return this.listFilasTurma.filter((fila) => fila.siape === siape);
  }

  async queryByTurma(id_turma: number): Promise<FilaTurma[]> {
    return this.listFilasTurma.filter((fila) => fila.id_turma === id_turma);
  }

  // async updateByTurmaEFila({
  //   siape,
  //   codigo_disc,
  //   pos,
  //   prioridade,
  //   qte_ministrada,
  //   qte_maxima,
  //   ano,
  //   semestre,
  //   status,
  //   periodo_preferencial,
  // }: IPatchFilaTurmaDTO): Promise<FilaTurma> {
  //   const filaFounded = this.listFilasTurma.find(
  //     (fila) => fila.id_turma === id_turma && fila.id_fila === id_fila
  //   );
  //
  //   Object.assign(filaFounded, {
  //     prioridade: prioridade || filaFounded.prioridade,
  //   });
  //
  //   this.listFilasTurma.push(filaFounded);
  //
  //   return filaFounded;
  // }
  //
  // async deleteByTurmaEFila(id_turma: number, id_fila: number): Promise<void> {
  //   const filaIndex = this.listFilasTurma.findIndex(
  //     (fila) => fila.id_turma === id_turma && fila.id_fila === id_fila
  //   );
  //
  //   if (filaIndex > -1) {
  //     this.listFilasTurma.splice(filaIndex, 1);
  //   }
  // }

  deleteById(id: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  updateById(data: IPatchFilaTurmaDTO): Promise<FilaTurma> {
    return Promise.resolve(undefined);
  }
}

export { FilaTurmaRepositoryTestMock };

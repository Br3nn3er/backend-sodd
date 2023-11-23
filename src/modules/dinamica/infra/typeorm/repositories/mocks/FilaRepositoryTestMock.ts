import {ICreateFilaDTO, IPatchFilaDTO} from "../../../../dtos/ICreateFilaDTO";
import {Fila} from "../../entities/Fila";
import {IFilaRepository} from "../interfaces/IFilaRepository";

class FilaRepositoryTestMock implements IFilaRepository {
  private filas: Fila[] = [];
  private count = 0;

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
  }: ICreateFilaDTO): Promise<Fila> {
    const fila = new Fila();

    this.count += 1;

    Object.assign(fila, {
      id: this.count,
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

    this.filas.push(fila);

    return fila;
  }

  async listFilas(): Promise<Fila[]> {
    return this.filas;
  }

  async queryById(id: number): Promise<Fila> {
    return this.filas.find((fila) => fila.id === id);
  }

  async queryByDiscEPosEAnoESemestre(
    codigo_disc: string,
    pos: number,
    ano: number,
    semestre: number
  ): Promise<Fila> {
    return this.filas.find(
      (fila) =>
        fila.codigo_disc === codigo_disc &&
        fila.pos === pos &&
        fila.ano === ano &&
        fila.semestre === semestre
    );
  }

  async queryBySiapeEDiscEAnoESemestre(
    siape: string,
    codigo_disc: string,
    ano: number,
    semestre: number
  ): Promise<Fila> {
    return this.filas.find(
      (fila) =>
        fila.siape === siape &&
        fila.codigo_disc === codigo_disc &&
        fila.ano === ano &&
        fila.semestre === semestre
    );
  }

  async queryBySiape(siape: string): Promise<Fila[]> {
    return this.filas.filter((fila) => fila.siape === siape);
  }

  async queryByDiscEAnoESemestre(
    codigo_disc: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]> {
    return this.filas.filter(
      (fila) =>
        fila.codigo_disc === codigo_disc &&
        fila.ano === ano &&
        fila.semestre === semestre
    );
  }

  async queryBySIAPEEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]> {
    return this.filas.filter(
      (fila) =>
        fila.siape === siape && fila.ano === ano && fila.semestre === semestre
    );
  }

  async queryByTurma(turma: number): Promise<Fila[]> {
    throw new Error("Method not implemented.");
  }

  async queryBySiapeEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]> {
    return this.filas.filter(
      (fila) =>
        fila.siape === siape && fila.ano === ano && fila.semestre === semestre
    );
  }

  async updateById({
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
    const filaToUpdate = this.filas.find((fila) => fila.id === id);

    Object.assign(filaToUpdate, {
      siape: siape || filaToUpdate.siape,
      codigo_disc: codigo_disc || filaToUpdate.codigo_disc,
      pos: pos || filaToUpdate.pos,
      prioridade: prioridade || filaToUpdate.prioridade,
      qte_ministrada: qte_ministrada || filaToUpdate.qte_ministrada,
      qte_maximo: qte_maximo || filaToUpdate.qte_maximo,
      ano: ano || filaToUpdate.ano,
      semestre: semestre || filaToUpdate.semestre,
      status: status || filaToUpdate.status,
      periodo_preferencial:
        periodo_preferencial === null || periodo_preferencial === undefined
          ? filaToUpdate.periodo_preferencial
          : periodo_preferencial,
    });

    this.filas.push(filaToUpdate);

    return filaToUpdate;
  }

  async deleteById(id: number): Promise<void> {
    const filaIndex = this.filas.findIndex((fila) => fila.id === id);

    if (filaIndex > -1) {
      this.filas.splice(filaIndex, 1);
    }
  }
}

export { FilaRepositoryTestMock };

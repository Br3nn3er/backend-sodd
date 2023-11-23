import { ICreateFilaDTO, IPatchFilaDTO } from "../../../../dtos/ICreateFilaDTO";
import { Fila } from "../../entities/Fila";

interface IFilaRepository {
  create(data: ICreateFilaDTO): Promise<Fila>;
  listFilas(): Promise<Fila[]>;
  queryById(id: number): Promise<Fila>;
  queryByDiscEPosEAnoESemestre(
    codigo_disc: string,
    pos: number,
    ano: number,
    semestre: number
  ): Promise<Fila>;
  queryByDiscEAnoESemestre(
    codigo_disc: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]>;
  queryBySiape(siape: string): Promise<Fila[]>;
  queryBySIAPEEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]>;
  queryBySiapeEDiscEAnoESemestre(
    siape: string,
    codigo_disc: string,
    ano: number,
    semestre: number
  ): Promise<Fila>;
  queryByTurma(turma: number): Promise<Fila[]>;
  queryBySiapeEAnoESemestre(
    siape: string,
    ano: number,
    semestre: number
  ): Promise<Fila[]>;
  updateById(data: IPatchFilaDTO): Promise<Fila>;
  deleteById(id: number): Promise<void>;
}

export { IFilaRepository };

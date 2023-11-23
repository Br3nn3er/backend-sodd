import {
  ICreateSemestreDTO,
  IPatchSemestreDTO,
} from "../../../../dtos/ICreateUpdateSemestreDTO";
import { Semestre } from "../../entities/Semestre";

interface ISemestresRepository {
  createSemestre(data: ICreateSemestreDTO): Promise<Semestre>;
  listAllSemestres(): Promise<Semestre[]>;
  queryById(id: number): Promise<Semestre>;
  queryByAnoSemestre(ano: number, semestre: number): Promise<Semestre>;
  updateById(data: IPatchSemestreDTO): Promise<Semestre>;
  deleteById(id: number): Promise<void>;
}

export { ISemestresRepository };

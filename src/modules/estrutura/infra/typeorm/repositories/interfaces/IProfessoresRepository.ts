import {
  ICreateProfessoresDTO,
  IPatchProfessorDTO,
} from "../../../../dtos/ICreateUpdateProfessoresDTO";
import { Professor } from "../../entities/Professor";

interface IProfessoresRepository {
  createProfessor(data: ICreateProfessoresDTO): Promise<Professor>;
  listAllProfessores(): Promise<Professor[]>;
  queryBySiape(siape: string): Promise<Professor>;
  deleteBySiape(siape: string): Promise<void>;
  updateBySiape(data: IPatchProfessorDTO): Promise<Professor>;
}

export { IProfessoresRepository };

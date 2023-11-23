import {
  ICreateCargaDocenteDTO,
  IPatchCargaDocenteDTO,
} from "../../../../dtos/ICreateUpdateCargaDocenteDTO";
import { CargaDocente } from "../../entities/CargaDocente";

interface ICargaDocentesRepository {
  createCarga(data: ICreateCargaDocenteDTO): Promise<CargaDocente>;
  listAllCargas(): Promise<CargaDocente[]>;
  queryBySiape(siape: string): Promise<CargaDocente>;
  updateBySiape(data: IPatchCargaDocenteDTO): Promise<CargaDocente>;
  deleteBySiape(siape: string): Promise<void>;
}

export { ICargaDocentesRepository };

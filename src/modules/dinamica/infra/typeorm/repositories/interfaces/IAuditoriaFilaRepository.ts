import {
  ICreateAuditoriaFilaDTO,
  IPatchAuditoriaFilaDTO,
} from "../../../../dtos/ICreateAuditoriaFilaDTO";
import { AuditoriaFila } from "../../entities/AuditoriaFila";

interface IAuditoriaFilaRepository {
  create(data: ICreateAuditoriaFilaDTO): Promise<AuditoriaFila>;
  listAllAuditorias(): Promise<AuditoriaFila[]>;
  queryById(id: string): Promise<AuditoriaFila>;
  queryBySiape(siape: string): Promise<AuditoriaFila>;
  updateById(data: IPatchAuditoriaFilaDTO): Promise<AuditoriaFila>;
  deleteById(id: string): Promise<void>;
}

export { IAuditoriaFilaRepository };

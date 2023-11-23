import {
  ICreateAuditoriaFilaNewDTO,
  IPatchAuditoriaFilaNewDTO,
} from "../../../../dtos/ICreateAuditoriaFilaNewDTO";
import { AuditoriaFilaNew } from "../../entities/AuditoriaFilaNew";

interface IAuditoriaFilaNewRepository {
  create(data: ICreateAuditoriaFilaNewDTO): Promise<AuditoriaFilaNew>;
  listAllAuditoriaNew(): Promise<AuditoriaFilaNew[]>;
  queryById(id: string): Promise<AuditoriaFilaNew>;
  queryByIdTurmaIdFila(
    id_turma: number,
    id_fila: number
  ): Promise<AuditoriaFilaNew>;
  updateById(data: IPatchAuditoriaFilaNewDTO): Promise<AuditoriaFilaNew>;
  deleteById(id: string): Promise<void>;
}

export { IAuditoriaFilaNewRepository };

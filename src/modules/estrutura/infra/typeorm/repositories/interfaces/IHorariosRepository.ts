import {
  ICreateHorarioDTO,
  IPatchHorarioDTO,
} from "../../../../dtos/ICreateUpdateHorarioDTO";
import { Horario } from "../../entities/Horario";

interface IHorariosRepository {
  createHorario(data: ICreateHorarioDTO): Promise<Horario>;
  listAllHorarios(): Promise<Horario[]>;
  queryByLetra(letra: string): Promise<Horario>;
  updateHorarioByLetra(data: IPatchHorarioDTO): Promise<Horario>;
  deleteByLetra(letra: string): Promise<void>;
}

export { IHorariosRepository };

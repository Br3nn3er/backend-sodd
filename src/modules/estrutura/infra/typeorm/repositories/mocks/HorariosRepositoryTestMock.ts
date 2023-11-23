import {ICreateHorarioDTO, IPatchHorarioDTO,} from "../../../../dtos/ICreateUpdateHorarioDTO";
import {Horario} from "../../entities/Horario";
import {IHorariosRepository} from "../interfaces/IHorariosRepository";

class HorariosRepositoryTestMock implements IHorariosRepository {
  private horarios: Horario[] = [];

  async createHorario({
    letra,
    hora_inicio,
    hora_fim,
    turno,
  }: ICreateHorarioDTO): Promise<Horario> {
    const horario = new Horario();

    Object.assign(horario, {
      letra,
      hora_inicio,
      hora_fim,
      turno,
    });

    this.horarios.push(horario);

    return horario;
  }

  async queryByLetra(letra: string): Promise<Horario> {
    return this.horarios.find((horario) => horario.letra === letra);
  }

  async listAllHorarios(): Promise<Horario[]> {
    return this.horarios;
  }

  async updateHorarioByLetra({
    letra,
    hora_inicio,
    hora_fim,
    turno,
  }: IPatchHorarioDTO): Promise<Horario> {
    const horario = this.horarios.find((horario) => horario.letra === letra);

    Object.assign(horario, {
      hora_inicio: hora_inicio || horario.hora_inicio,
      hora_fim: hora_fim || horario.hora_fim,
      turno: turno || horario.turno,
    });

    this.horarios.push(horario);

    return horario;
  }

  async deleteByLetra(letra: string): Promise<void> {
    const horarioIndex = this.horarios.findIndex(
      (horario) => horario.letra === letra
    );

    if (horarioIndex > -1) {
      this.horarios.splice(horarioIndex, 1);
    }
  }
}

export { HorariosRepositoryTestMock };

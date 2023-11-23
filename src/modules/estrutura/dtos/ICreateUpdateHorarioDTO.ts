interface ICreateHorarioDTO {
  letra: string;
  hora_inicio: string;
  hora_fim: string;
  turno: string;
}

interface IPatchHorarioDTO {
  letra: string;
  hora_inicio?: string;
  hora_fim?: string;
  turno?: string;
}

export { ICreateHorarioDTO, IPatchHorarioDTO };

interface ICreateCursosDTO {
  nome: string;
  codigo: string;
  unidade: string;
  campus: string;
  permitir_choque_periodo: boolean;
  permitir_choque_horario: boolean;
}

interface IPatchCursosDTO {
  codigo: string;
  nome?: string;
  unidade?: string;
  campus?: string;
  permitir_choque_periodo?: boolean;
  permitir_choque_horario?: boolean;
}

export { ICreateCursosDTO, IPatchCursosDTO };

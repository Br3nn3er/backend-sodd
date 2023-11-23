interface ICreateTurmaDTO {
  codigo_disc: string;
  turma: string;
  ch: number;
  ano: number;
  semestre: number;
}

interface IPatchTurmaDTO {
  id: string;
  codigo_disc?: string;
  turma?: string;
  ch?: number;
  ano?: number;
  semestre?: number;
}

export { ICreateTurmaDTO, IPatchTurmaDTO };

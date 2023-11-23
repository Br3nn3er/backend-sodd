interface ICreateAuditoriaFilaNewDTO {
  id_turma: number;
  id_fila: number;
  prioridade_old: number;
  prioridade_new: number;
  stamp: Date;
}

interface IPatchAuditoriaFilaNewDTO {
  id: string;
  id_turma?: number;
  id_fila?: number;
  prioridade_old?: number;
  prioridade_new?: number;
  stamp?: Date;
}

export { ICreateAuditoriaFilaNewDTO, IPatchAuditoriaFilaNewDTO };

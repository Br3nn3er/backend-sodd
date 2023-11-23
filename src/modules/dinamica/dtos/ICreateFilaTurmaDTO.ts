interface ICreateFilaTurmaDTO {
  siape: string;
  id_turma: number;
  codigo_disc: string;
  turma: string;
  pos: number;
  prioridade: number;
  qte_ministrada: number;
  qte_maximo: number;
  status: number;
  ch: number;
  id: number;
  periodo_preferencial: boolean;
}

interface IPatchFilaTurmaDTO {
  id: number;
  siape?: string;
  id_turma?: number;
  codigo_disc?: string;
  turma?: string;
  pos?: number;
  prioridade?: number;
  qte_ministrada?: number;
  qte_maximo?: number;
  status?: number;
  ch?: number;
  periodo_preferencial?: boolean;
}

export { ICreateFilaTurmaDTO, IPatchFilaTurmaDTO };

interface ICreateFilaDTO {
  siape: string;
  codigo_disc: string;
  pos: number;
  prioridade: number;
  qte_ministrada: number;
  qte_maximo: number;
  ano: number;
  semestre: number;
  status: number;
  periodo_preferencial: boolean;
}

interface IPatchFilaDTO {
  id: number;
  siape?: string;
  codigo_disc?: string;
  pos?: number;
  prioridade?: number;
  qte_ministrada?: number;
  qte_maximo?: number;
  ano?: number;
  semestre?: number;
  status?: number;
  periodo_preferencial?: boolean;
}

export { ICreateFilaDTO, IPatchFilaDTO };

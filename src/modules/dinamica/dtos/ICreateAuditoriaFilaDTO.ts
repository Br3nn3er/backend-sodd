interface ICreateAuditoriaFilaDTO {
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
  comando: string;
  stamp: Date;
}

interface IPatchAuditoriaFilaDTO {
  id: string;
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
  comando?: string;
  stamp?: Date;
}

export { ICreateAuditoriaFilaDTO, IPatchAuditoriaFilaDTO };

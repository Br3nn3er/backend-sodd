interface ICreateAuditoriaPrioridadeDTO {
  siape: string;
  codigo_disc: string;
  prioridade_antiga: number;
  prioridade_nova: number;
  stamp: Date;
}

interface IPatchAuditoriaPrioridadeDTO {
  id: string;
  siape?: string;
  codigo_disc?: string;
  prioridade_antiga?: number;
  prioridade_nova?: number;
  stamp?: Date;
}

export { ICreateAuditoriaPrioridadeDTO, IPatchAuditoriaPrioridadeDTO };

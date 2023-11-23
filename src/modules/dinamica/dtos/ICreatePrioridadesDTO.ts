interface ICreatePrioridadesDTO {
  prioridade: number;
  codigo_disc: string;
  siape: string;
}

interface IPatchPrioridadesDTO {
  id: string;
  prioridade?: number;
  codigo_disc?: string;
  siape?: string;
}

export { ICreatePrioridadesDTO, IPatchPrioridadesDTO };

interface ICreateProfessoresDTO {
  siape: string;
  nome: string;
  data_ingresso: Date;
  data_nasc: Date;
  afastado: boolean;
  regime: string;
  carga_atual: number;
  locacao: string;
  cnome: string;
  data_saida: Date;
  data_exoneracao: Date;
  data_aposentadoria: Date;
  status: string;
}

interface IPatchProfessorDTO {
  siape: string;
  nome?: string;
  data_ingresso?: Date;
  data_nasc?: Date;
  afastado?: boolean;
  regime?: string;
  carga_atual?: number;
  locacao?: string;
  cnome?: string;
  data_saida?: Date;
  data_exoneracao?: Date;
  data_aposentadoria?: Date;
  status?: string;
}

export { ICreateProfessoresDTO, IPatchProfessorDTO };

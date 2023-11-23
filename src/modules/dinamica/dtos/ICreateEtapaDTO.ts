interface ICreateEtapaDTO {
  codigo: string;
  ativo: boolean;
  descricao: string;
}

interface IPatchEtapaDTO {
  id: string;
  codigo?: string;
  ativo?: boolean;
  descricao?: string;
}

export { ICreateEtapaDTO, IPatchEtapaDTO };

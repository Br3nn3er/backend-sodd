interface ICreateStatusDistribuicaoDTO {
  id: number;
  descricao: string;
}

interface IPatchStatusDistribuicaoDTO {
  codigo: string;
  id?: number;
  descricao?: string;
}

export { ICreateStatusDistribuicaoDTO, IPatchStatusDistribuicaoDTO };

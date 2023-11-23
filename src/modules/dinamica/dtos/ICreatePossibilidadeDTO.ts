interface ICreatePossibilidadeDTO {
  descricao: string;
  num_cenario: number;
}

interface IPatchPossibilidadeDTO {
  id: string;
  descricao?: string;
  num_cenario?: number;
}

export { ICreatePossibilidadeDTO, IPatchPossibilidadeDTO };

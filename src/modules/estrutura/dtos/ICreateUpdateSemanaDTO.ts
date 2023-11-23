interface ICreateSemanaDTO {
  dia: string;
  descricao: string;
}

interface IPatchSemanaDTO {
  dia: string;
  descricao?: string;
}

export { ICreateSemanaDTO, IPatchSemanaDTO };

interface ICreateCenarioDTO {
  descricao_cenario: string;
  ano: number;
  semestre: number;
}

interface IPatchCenarioDTO {
  num_cenario: string;
  descricao_cenario?: string;
  ano?: number;
  semestre?: number;
}

export { ICreateCenarioDTO, IPatchCenarioDTO };

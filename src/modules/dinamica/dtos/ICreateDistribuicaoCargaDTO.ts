interface ICreateDistribuicaoCargaDTO {
  cenario: number;
  siape: string;
  regra: string;
  carga: number;
}

interface IPatchDistribuicaoCargaDTO {
  cenario: number;
  siape: string;
  regra: string;
  carga?: number;
}

export { ICreateDistribuicaoCargaDTO, IPatchDistribuicaoCargaDTO };

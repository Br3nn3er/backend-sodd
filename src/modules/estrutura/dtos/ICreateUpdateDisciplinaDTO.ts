interface ICreateDisciplinaDTO {
  codigo: string;
  nome: string;
  ch_teorica: number;
  ch_pratica: number;
  ch_total: number;
  curso: string;
  temfila: boolean;
  periodo: number;
  cod_antigo: string;
}

interface IPatchDisciplinaDTO {
  codigo: string;
  nome?: string;
  ch_teorica?: number;
  ch_pratica?: number;
  ch_total?: number;
  curso?: string;
  temfila?: boolean;
  periodo?: number;
}

export { ICreateDisciplinaDTO, IPatchDisciplinaDTO };

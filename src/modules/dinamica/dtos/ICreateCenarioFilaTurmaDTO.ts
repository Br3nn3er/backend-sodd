interface ICreateCenarioFilaTurmaDTO {
  num_cenario: number;
  id_turma: number;
  id_fila: number;
  status: number;
  prioridade: number;
  posicao: number;
}

interface IPatchCenarioFilaTurmaDTO {
  num_cenario: number;
  id_turma: number;
  id_fila: number;
  status?: number;
  prioridade?: number;
  posicao?: number;
}

export { ICreateCenarioFilaTurmaDTO, IPatchCenarioFilaTurmaDTO };

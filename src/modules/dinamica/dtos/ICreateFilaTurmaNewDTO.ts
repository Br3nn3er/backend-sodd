interface ICreateFilaTurmaNewDTO {
  id_turma: number;
  id_fila: number;
  prioridade: number;
}

interface IPatchFilaTurmaNewDTO {
  id_turma: number;
  id_fila: number;
  prioridade?: number;
}

export { ICreateFilaTurmaNewDTO, IPatchFilaTurmaNewDTO };

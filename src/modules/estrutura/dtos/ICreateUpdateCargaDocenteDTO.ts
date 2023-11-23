interface ICreateCargaDocenteDTO {
  siape: string;
  carga_atual: number;
  ano: number;
  semestre: number;
}

interface IPatchCargaDocenteDTO {
  siape: string;
  carga_atual?: number;
  ano?: number;
  semestre?: number;
}

export { ICreateCargaDocenteDTO, IPatchCargaDocenteDTO };

interface ICreateSemestreDTO {
  ano: number;
  semestre: number;
  status: boolean;
}

interface IPatchSemestreDTO {
  id: number;
  ano?: number;
  semestre?: number;
  status?: boolean;
}

export { ICreateSemestreDTO, IPatchSemestreDTO };

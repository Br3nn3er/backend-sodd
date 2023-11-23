import {ICreateSemestreDTO, IPatchSemestreDTO,} from "../../../../dtos/ICreateUpdateSemestreDTO";
import {Semestre} from "../../entities/Semestre";
import {ISemestresRepository} from "../interfaces/ISemestresRepository";

class SemestresRepositoryTestMock implements ISemestresRepository {
  private semestres: Semestre[] = [];
  private count = 0;

  async createSemestre({
    ano,
    semestre,
    status,
  }: ICreateSemestreDTO): Promise<Semestre> {
    const semestreToCreate = new Semestre();

    this.count += 1;

    Object.assign(semestreToCreate, {
      id: this.count,
      ano,
      semestre,
      status,
    });

    this.semestres.push(semestreToCreate);

    return semestreToCreate;
  }

  async listAllSemestres(): Promise<Semestre[]> {
    return this.semestres;
  }

  async queryById(id: number): Promise<Semestre> {
    return this.semestres.find(
      (semestre) => semestre.id === id
    );
  }

  async queryByAnoSemestre(ano: number, semestre: number): Promise<Semestre> {
    return this.semestres.find(
      (semestreToSearch) =>
        semestreToSearch.ano === ano && semestreToSearch.semestre === semestre
    );
  }

  async updateById({
    id,
    ano,
    semestre,
    status,
  }: IPatchSemestreDTO): Promise<Semestre> {
    const semestreFounded = this.semestres.find(
      (semestre) => semestre.id === id
    );

    Object.assign(semestreFounded, {
      ano: ano || semestreFounded.ano,
      semestre: semestre || semestreFounded.semestre,
      status:
        status === null || status === undefined
          ? semestreFounded.status
          : status,
    });

    this.semestres.push(semestreFounded);

    return semestreFounded;
  }

  async deleteById(id: number): Promise<void> {
    const semestreIndex = this.semestres.findIndex(
      (semestre) => semestre.id === id
    );

    if (semestreIndex > -1) {
      this.semestres.splice(semestreIndex, 1);
    }
  }
}

export { SemestresRepositoryTestMock };

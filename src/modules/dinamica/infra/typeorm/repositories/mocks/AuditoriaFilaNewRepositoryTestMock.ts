import {ICreateAuditoriaFilaNewDTO, IPatchAuditoriaFilaNewDTO,} from "../../../../dtos/ICreateAuditoriaFilaNewDTO";
import {AuditoriaFilaNew} from "../../entities/AuditoriaFilaNew";
import {IAuditoriaFilaNewRepository} from "../interfaces/IAuditoriaFilaNewRepository";

class AuditoriaFilaNewRepositoryTestMock
  implements IAuditoriaFilaNewRepository
{
  private auditoriasNew: AuditoriaFilaNew[] = [];
  private count = 0;

  async create({
    id_turma,
    id_fila,
    prioridade_old,
    prioridade_new,
    stamp,
  }: ICreateAuditoriaFilaNewDTO): Promise<AuditoriaFilaNew> {
    const auditoriaNew = new AuditoriaFilaNew();

    this.count += 1;

    Object.assign(auditoriaNew, {
      id: this.count.toString(),
      id_turma,
      id_fila,
      prioridade_old,
      prioridade_new,
      stamp,
    });

    this.auditoriasNew.push(auditoriaNew);

    return auditoriaNew;
  }

  async listAllAuditoriaNew(): Promise<AuditoriaFilaNew[]> {
    return this.auditoriasNew;
  }

  async queryById(id: string): Promise<AuditoriaFilaNew> {
    return this.auditoriasNew.find(
      (auditoriaToSearch) => auditoriaToSearch.id === id
    );
  }

  async queryByIdTurmaIdFila(
    id_turma: number,
    id_fila: number
  ): Promise<AuditoriaFilaNew> {
    return this.auditoriasNew.find(
      (auditoriaToSearch) =>
        auditoriaToSearch.id_turma === id_turma &&
        auditoriaToSearch.id_fila === id_fila
    );
  }

  async updateById({
    id,
    id_turma,
    id_fila,
    prioridade_old,
    prioridade_new,
    stamp,
  }: IPatchAuditoriaFilaNewDTO): Promise<AuditoriaFilaNew> {
    const auditoriaNewToUpdate = this.auditoriasNew.find(
      (auditoriaToSearch) => auditoriaToSearch.id === id
    );

    Object.assign(auditoriaNewToUpdate, {
      id_turma: id_turma || auditoriaNewToUpdate.id_turma,
      id_fila: id_fila || auditoriaNewToUpdate.id_fila,
      prioridade_old: prioridade_old || auditoriaNewToUpdate.prioridade_old,
      prioridade_new: prioridade_new || auditoriaNewToUpdate.prioridade_new,
      stamp: stamp || auditoriaNewToUpdate.stamp,
    });

    this.auditoriasNew.push(auditoriaNewToUpdate);

    return auditoriaNewToUpdate;
  }

  async deleteById(id: string): Promise<void> {
    const auditoriaNewIndex = this.auditoriasNew.findIndex(
      (auditoria) => auditoria.id === id
    );

    if (auditoriaNewIndex > -1) {
      this.auditoriasNew.splice(auditoriaNewIndex, 1);
    }
  }
}

export { AuditoriaFilaNewRepositoryTestMock };

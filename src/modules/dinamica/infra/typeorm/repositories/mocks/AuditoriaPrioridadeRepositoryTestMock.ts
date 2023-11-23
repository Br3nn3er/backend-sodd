import {
  ICreateAuditoriaPrioridadeDTO,
  IPatchAuditoriaPrioridadeDTO,
} from "../../../../dtos/ICreateAuditoriaPrioridadeDTO";
import {AuditoriaPrioridade} from "../../entities/AuditoriaPrioridade";
import {IAuditoriaPrioridadeRepository} from "../interfaces/IAuditoriaPrioridadeRepository";

class AuditoriaPrioridadeRepositoryTestMock
  implements IAuditoriaPrioridadeRepository
{
  private auditoriasPrioridade: AuditoriaPrioridade[] = [];
  private count = 0;

  async create({
    siape,
    codigo_disc,
    prioridade_antiga,
    prioridade_nova,
    stamp,
  }: ICreateAuditoriaPrioridadeDTO): Promise<AuditoriaPrioridade> {
    const auditoria = new AuditoriaPrioridade();

    this.count += 1;

    Object.assign(auditoria, {
      id: this.count.toString(),
      siape,
      codigo_disc,
      prioridade_antiga,
      prioridade_nova,
      stamp,
    });

    this.auditoriasPrioridade.push(auditoria);

    return auditoria;
  }

  async listAllAuditorias(): Promise<AuditoriaPrioridade[]> {
    return this.auditoriasPrioridade;
  }

  async queryById(id: string): Promise<AuditoriaPrioridade> {
    return this.auditoriasPrioridade.find(
      (auditoriaToSearch) => auditoriaToSearch.id === id
    );
  }

  async queryBySiape(siape: string): Promise<AuditoriaPrioridade> {
    return this.auditoriasPrioridade.find(
      (auditoriaToSearch) => auditoriaToSearch.siape === siape
    );
  }

  async update({
    id,
    siape,
    codigo_disc,
    prioridade_antiga,
    prioridade_nova,
    stamp,
  }: IPatchAuditoriaPrioridadeDTO): Promise<AuditoriaPrioridade> {
    const auditoriaToUpdate = this.auditoriasPrioridade.find(
      (auditoriaToSearch) => auditoriaToSearch.id === id
    );

    Object.assign(auditoriaToUpdate, {
      siape: siape || auditoriaToUpdate.siape,
      codigo_disc: codigo_disc || auditoriaToUpdate.codigo_disc,
      prioridade_antiga:
        prioridade_antiga || auditoriaToUpdate.prioridade_antiga,
      prioridade_nova: prioridade_nova || auditoriaToUpdate.prioridade_nova,
      stamp: stamp || auditoriaToUpdate.stamp,
    });

    this.auditoriasPrioridade.push(auditoriaToUpdate);

    return auditoriaToUpdate;
  }

  async deleteById(id: string): Promise<void> {
    const auditoriaNewIndex = this.auditoriasPrioridade.findIndex(
      (auditoria) => auditoria.id === id
    );

    if (auditoriaNewIndex > -1) {
      this.auditoriasPrioridade.splice(auditoriaNewIndex, 1);
    }
  }
}

export { AuditoriaPrioridadeRepositoryTestMock };

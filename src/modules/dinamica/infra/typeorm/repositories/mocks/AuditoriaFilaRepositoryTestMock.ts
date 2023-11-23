import {ICreateAuditoriaFilaDTO, IPatchAuditoriaFilaDTO,} from "../../../../dtos/ICreateAuditoriaFilaDTO";
import {AuditoriaFila} from "../../entities/AuditoriaFila";
import {IAuditoriaFilaRepository} from "../interfaces/IAuditoriaFilaRepository";

class AuditoriaFilaRepositoryTestMock implements IAuditoriaFilaRepository {
  private auditorias: AuditoriaFila[] = [];
  private count = 0;

  async create({
    siape,
    codigo_disc,
    pos,
    prioridade,
    qte_ministrada,
    qte_maximo,
    ano,
    semestre,
    status,
    periodo_preferencial,
    comando,
    stamp,
  }: ICreateAuditoriaFilaDTO): Promise<AuditoriaFila> {
    const auditoria = new AuditoriaFila();

    this.count += 1;

    Object.assign(auditoria, {
      id: this.count.toString(),
      siape,
      codigo_disc,
      pos,
      prioridade,
      qte_ministrada,
      qte_maximo,
      ano,
      semestre,
      status,
      periodo_preferencial,
      comando,
      stamp,
    });

    this.auditorias.push(auditoria);

    return auditoria;
  }

  async listAllAuditorias(): Promise<AuditoriaFila[]> {
    return this.auditorias;
  }

  async queryById(id: string): Promise<AuditoriaFila> {
    return this.auditorias.find(
      (auditoriaToSearch) => auditoriaToSearch.id === id
    );
  }

  async queryBySiape(siape: string): Promise<AuditoriaFila> {
    return this.auditorias.find(
      (auditoriaToSearch) => auditoriaToSearch.siape === siape
    );
  }

  async updateById({
    id,
    siape,
    codigo_disc,
    pos,
    prioridade,
    qte_ministrada,
    qte_maximo,
    ano,
    semestre,
    status,
    periodo_preferencial,
    comando,
    stamp,
  }: IPatchAuditoriaFilaDTO): Promise<AuditoriaFila> {
    const auditoria = this.auditorias.find(
      (auditoriaToSearch) => auditoriaToSearch.id === id
    );

    Object.assign(auditoria, {
      siape: siape || auditoria.siape,
      codigo_disc: codigo_disc || auditoria.codigo_disc,
      pos: pos || auditoria.pos,
      prioridade: prioridade || auditoria.prioridade,
      qte_ministrada: qte_ministrada || auditoria.qte_ministrada,
      qte_maximo: qte_maximo || auditoria.qte_maximo,
      ano: ano || auditoria.ano,
      semestre: semestre || auditoria.semestre,
      status: status || auditoria.status,
      periodo_preferencial:
        periodo_preferencial === null || periodo_preferencial === undefined
          ? auditoria.periodo_preferencial
          : periodo_preferencial,
      comando: comando || auditoria.comando,
      stamp: stamp || auditoria.stamp,
    });

    this.auditorias.push(auditoria);

    return auditoria;
  }

  async deleteById(id: string): Promise<void> {
    const auditoriaIndex = this.auditorias.findIndex(
      (auditoria) => auditoria.id === id
    );

    if (auditoriaIndex > -1) {
      this.auditorias.splice(auditoriaIndex, 1);
    }
  }
}

export { AuditoriaFilaRepositoryTestMock };

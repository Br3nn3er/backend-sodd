import {
  ICreateAuditoriaPrioridadeDTO,
  IPatchAuditoriaPrioridadeDTO,
} from "../../../../dtos/ICreateAuditoriaPrioridadeDTO";
import { AuditoriaPrioridade } from "../../entities/AuditoriaPrioridade";

interface IAuditoriaPrioridadeRepository {
  create(data: ICreateAuditoriaPrioridadeDTO): Promise<AuditoriaPrioridade>;
  listAllAuditorias(): Promise<AuditoriaPrioridade[]>;
  queryById(id: string): Promise<AuditoriaPrioridade>;
  queryBySiape(siape: string): Promise<AuditoriaPrioridade>;
  update(data: IPatchAuditoriaPrioridadeDTO): Promise<AuditoriaPrioridade>;
  deleteById(id: string): Promise<void>;
}

export { IAuditoriaPrioridadeRepository };

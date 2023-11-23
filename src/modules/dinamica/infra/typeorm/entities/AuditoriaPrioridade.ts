import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("auditoria_prioridade")
class AuditoriaPrioridade {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  siape: string;

  @Column()
  codigo_disc: string;

  @Column()
  prioridade_antiga: number;

  @Column()
  prioridade_nova: number;

  @Column()
  stamp: Date;

  @CreateDateColumn()
  created_at: Date;
}

export { AuditoriaPrioridade };

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("auditoria_fila_turma_new")
class AuditoriaFilaNew {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  id_turma: number;

  @Column()
  id_fila: number;

  @Column()
  prioridade_old: number;

  @Column()
  prioridade_new: number;

  @Column()
  stamp: Date;

  @CreateDateColumn()
  created_at: Date;
}

export { AuditoriaFilaNew };

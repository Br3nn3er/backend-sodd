import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { Turma } from "../../../../estrutura/infra/typeorm/entities/Turma";
import { Fila } from "./Fila";

@Entity("fila_turma_new")
class FilaTurmaNew {
  @ManyToOne(() => Turma)
  @JoinColumn({ name: "id_turma" })
  turma: Turma;

  @PrimaryColumn()
  id_turma: number;

  @ManyToOne(() => Fila)
  @JoinColumn({ name: "id_fila" })
  fila: Fila;

  @PrimaryColumn()
  id_fila: number;

  @Column()
  prioridade: number;

  @CreateDateColumn()
  created_at: Date;
}

export { FilaTurmaNew };

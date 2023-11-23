import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { FilaTurmaNew } from "../../../../dinamica/infra/typeorm/entities/FilaTurmaNew";
import { Disciplina } from "./Disciplina";

@Entity("turma")
class Turma {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Disciplina)
  @JoinColumn({ name: "codigo_disc" })
  disciplina: Disciplina;

  @OneToOne(() => FilaTurmaNew)
  @JoinColumn({ name: "id", referencedColumnName: "id_turma" })
  fila_turma_new: FilaTurmaNew;

  @Column({
    transformer: {
      from: (value: string) => value.trim(),
      to: (value: string) => value,
    },
  })
  codigo_disc: string;

  @Column({
    transformer: {
      from: (value: string) => value.trim(),
      to: (value: string) => value,
    },
  })
  turma: string;

  @Column()
  ch: number;

  @Column()
  ano: number;

  @Column()
  semestre: number;

  @CreateDateColumn()
  created_at: Date;
}

export { Turma };

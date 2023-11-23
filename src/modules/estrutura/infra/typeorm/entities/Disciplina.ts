import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

import { Curso } from "./Curso";

@Entity("disciplina")
class Disciplina {
  @PrimaryColumn({
    transformer: {
      from: (value: string) => value.trim(),
      to: (value: string) => value,
    },
  })
  codigo: string;

  @Column()
  nome: string;

  @Column()
  ch_teorica: number;

  @Column()
  ch_pratica: number;

  @Column()
  ch_total: number;

  @ManyToOne(() => Curso)
  @JoinColumn({ name: "curso" })
  curso_disciplinas: Curso;

  @Column()
  curso: string;

  @Column()
  temfila: boolean;

  @Column()
  periodo: number;

  @OneToOne(() => Disciplina)
  @JoinColumn({ name: "cod_antigo" })
  disciplina: Disciplina;

  @Column()
  cod_antigo: string;

  @CreateDateColumn()
  created_at: Date;
  siape: string;
  ano: number;
}

export { Disciplina };

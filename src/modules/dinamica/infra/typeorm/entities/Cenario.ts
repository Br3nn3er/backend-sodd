import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Semestre } from "../../../../estrutura/infra/typeorm/entities/Semestre";

@Entity("cenario")
class Cenario {
  @PrimaryGeneratedColumn()
  num_cenario: string;

  @Column()
  descricao_cenario: string;

  @ManyToOne(() => Semestre)
  @JoinColumn([{ name: "ano" }, { name: "semestre" }])
  semestre_t: Semestre;

  @Column()
  ano: number;

  @Column()
  semestre: number;

  @CreateDateColumn()
  created_at: Date;
}

export { Cenario };

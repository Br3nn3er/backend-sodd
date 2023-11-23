import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { Cenario } from "./Cenario";
import { FilaTurmaNew } from "./FilaTurmaNew";

@Entity("cenario_fila_turma")
class CenarioFilaTurma {
  @ManyToOne(() => Cenario)
  @JoinColumn({ name: "num_cenario" })
  cenario: Cenario;

  @PrimaryColumn()
  num_cenario: number;

  @ManyToOne(() => FilaTurmaNew)
  @JoinColumn([{ name: "id_turma" }, { name: "id_fila" }])
  filaTurmaNew: FilaTurmaNew;

  @PrimaryColumn()
  id_turma: number;

  @PrimaryColumn()
  id_fila: number;

  @Column()
  status: number;

  @Column()
  prioridade: number;

  @Column()
  posicao: number;

  @CreateDateColumn()
  created_at: Date;
}

export { CenarioFilaTurma };

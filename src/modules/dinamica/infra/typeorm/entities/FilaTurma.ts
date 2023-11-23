import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { StatusDistribuicao } from "./StatusDistribuicao";

@Entity("fila_turma")
class FilaTurma {
  @Column()
  siape: string;

  @Column()
  id_turma: number;

  @Column()
  codigo_disc: string;

  @Column()
  turma: string;

  @Column()
  pos: number;

  @Column()
  prioridade: number;

  @Column()
  qte_ministrada: number;

  @Column()
  qte_maximo: number;

  @Column()
  status: number;

  @ManyToOne(() => StatusDistribuicao)
  @JoinColumn({ name: "status" })
  status_distribuicao: StatusDistribuicao;

  @Column()
  ch: number;

  @PrimaryColumn()
  id: number;

  @Column()
  periodo_preferencial: boolean;

  @CreateDateColumn()
  created_at: Date;
}

export { FilaTurma };

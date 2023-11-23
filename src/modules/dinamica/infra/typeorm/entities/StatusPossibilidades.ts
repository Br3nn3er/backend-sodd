import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { Fila } from "./Fila";
import { Possibilidades } from "./Possibilidades";
import { StatusDistribuicao } from "./StatusDistribuicao";

@Entity("status_possibilidades")
class StatusPossibilidades {
  @ManyToOne(() => Fila)
  @JoinColumn({ name: "id_fila" })
  fila: Fila;

  @PrimaryColumn()
  id_fila: number;

  @ManyToOne(() => Possibilidades)
  @JoinColumn({ name: "id_possibilidade" })
  possibilidades: Possibilidades;

  @PrimaryColumn()
  id_possibilidade: number;

  @ManyToOne(() => StatusDistribuicao)
  @JoinColumn({ name: "status" })
  statusDistribuicao: StatusDistribuicao;

  @Column()
  status: number;

  @CreateDateColumn()
  created_at: Date;
}

export { StatusPossibilidades };

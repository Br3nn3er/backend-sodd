import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";
import { Turma } from "../../../../estrutura/infra/typeorm/entities/Turma";
import { Possibilidades } from "./Possibilidades";

@Entity("distribuicoes_possibilidade")
class DistribuicoesPossibilidade {
  @ManyToOne(() => Possibilidades)
  @JoinColumn({ name: "id_possibilidade" })
  possibilidades: Possibilidades;

  @PrimaryColumn()
  id_possibilidade: number;

  @ManyToOne(() => Professor)
  @JoinColumn({ name: "siape" })
  professor: Professor;

  @PrimaryColumn()
  siape: string;

  @ManyToOne(() => Turma)
  @JoinColumn({ name: "id_turma" })
  turma: Turma;

  @PrimaryColumn()
  id_turma: number;

  @CreateDateColumn()
  created_at: Date;
}

export { DistribuicoesPossibilidade };

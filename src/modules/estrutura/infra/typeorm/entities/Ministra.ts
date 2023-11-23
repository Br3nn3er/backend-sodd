import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

import { Oferta } from "../../../../dinamica/infra/typeorm/entities/Oferta";
import { Professor } from "./Professor";
import { Turma } from "./Turma";

@Entity("ministra")
class Ministra {
  @ManyToOne(() => Professor)
  @JoinColumn({ name: "siape" })
  professor: Professor;

  @PrimaryColumn()
  siape: string;

  @ManyToOne(() => Turma)
  @JoinColumn({ name: "id_turma" })
  turma: Turma;

  ofertas: Oferta[];

  @PrimaryColumn()
  id_turma: string;

  @CreateDateColumn()
  created_at: Date;
}

export { Ministra };

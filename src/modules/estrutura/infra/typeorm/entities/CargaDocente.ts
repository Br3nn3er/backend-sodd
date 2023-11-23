import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { Professor } from "./Professor";

@Entity("carga_docente")
class CargaDocente {
  @ManyToOne(() => Professor)
  @JoinColumn({ name: "siape" })
  professor: Professor;

  @PrimaryColumn()
  siape: string;

  @Column()
  carga_atual: number;

  @Column()
  ano: number;

  @Column()
  semestre: number;

  @CreateDateColumn()
  created_at: Date;
}

export { CargaDocente };

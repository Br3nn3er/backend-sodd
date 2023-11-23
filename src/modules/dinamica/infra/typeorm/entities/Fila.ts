import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Disciplina } from "../../../../estrutura/infra/typeorm/entities/Disciplina";
import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";

@Entity("fila")
class Fila {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Professor)
  @JoinColumn({ name: "siape" })
  professor: Professor;

  @Column({
    transformer: {
      from: (value: string) => value.trim(),
      to: (value: string) => value,
    },
  })
  siape: string;

  @ManyToOne(() => Disciplina)
  @JoinColumn({ name: "codigo_disc" })
  disciplina: Disciplina;

  @Column({
    transformer: {
      from: (value: string) => value.trim(),
      to: (value: string) => value,
    },
  })
  codigo_disc: string;

  @Column()
  pos: number;

  @Column()
  prioridade: number;

  @Column()
  qte_ministrada: number;

  @Column()
  qte_maximo: number;

  @Column()
  ano: number;

  @Column()
  semestre: number;

  @Column()
  status: number;

  @Column()
  periodo_preferencial: boolean;

  @CreateDateColumn()
  created_at: Date;
}

export { Fila };

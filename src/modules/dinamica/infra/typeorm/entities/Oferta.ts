import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Horario } from "../../../../estrutura/infra/typeorm/entities/Horario";
import { Semana } from "../../../../estrutura/infra/typeorm/entities/Semana";
import { Turma } from "../../../../estrutura/infra/typeorm/entities/Turma";

@Entity("oferta")
class Oferta {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Semana)
  @JoinColumn({ name: "dia" })
  semana: Semana;

  @Column({
    transformer: {
      from: (value: string) => value.trim(),
      to: (value: string) => value,
    },
  })
  dia: string;

  @ManyToOne(() => Horario)
  @JoinColumn({ name: "letra" })
  horario: Horario;

  @Column({
    transformer: {
      from: (value: string) => value.trim(),
      to: (value: string) => value,
    },
  })
  letra: string;

  @ManyToOne(() => Turma)
  @JoinColumn({ name: "id_turma", referencedColumnName: "id" })
  turma: Turma;

  @Column()
  id_turma: number;

  @CreateDateColumn()
  created_at: Date;
}

export { Oferta };

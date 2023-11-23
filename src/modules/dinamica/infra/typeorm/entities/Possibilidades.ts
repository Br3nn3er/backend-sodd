import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Cenario } from "./Cenario";

@Entity("possibilidades")
class Possibilidades {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  descricao: string;

  @ManyToOne(() => Cenario)
  @JoinColumn({ name: "num_cenario" })
  cenario: Cenario;

  @Column()
  num_cenario: number;

  @CreateDateColumn()
  created_at: Date;
}

export { Possibilidades };

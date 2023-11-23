import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("prioridades")
class Prioridades {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  prioridade: number;

  @Column()
  codigo_disc: string;

  @Column()
  siape: string;

  @CreateDateColumn()
  created_at: Date;
}

export { Prioridades };

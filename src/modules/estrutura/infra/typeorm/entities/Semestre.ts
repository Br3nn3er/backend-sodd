import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("semestres")
class Semestre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ano: number;

  @Column()
  semestre: number;

  @Column()
  status: boolean;

  @CreateDateColumn()
  created_at: Date;
}

export { Semestre };

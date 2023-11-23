import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("semana")
class Semana {
  @PrimaryColumn()
  dia: string;

  @Column()
  descricao: string;

  @CreateDateColumn()
  created_at: Date;
}

export { Semana };

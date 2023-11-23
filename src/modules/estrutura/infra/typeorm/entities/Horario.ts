import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("horario")
class Horario {
  @PrimaryColumn()
  letra: string;

  @Column()
  hora_inicio: string;

  @Column()
  hora_fim: string;

  @Column()
  turno: string;

  @CreateDateColumn()
  created_at: Date;
}

export { Horario };

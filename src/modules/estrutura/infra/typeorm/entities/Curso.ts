import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("curso")
class Curso {
  @PrimaryColumn()
  codigo: string;

  @Column()
  nome: string;

  @Column()
  unidade: string;

  @Column()
  campus: string;

  @Column()
  permitir_choque_periodo: boolean;

  @Column()
  permitir_choque_horario: boolean;

  @CreateDateColumn()
  created_at: Date;
}

export { Curso };

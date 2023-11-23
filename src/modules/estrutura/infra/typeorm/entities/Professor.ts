import { Column, Entity, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity("professor")
class Professor {
  @PrimaryColumn()
  siape: string;

  @Column()
  nome: string;

  @Column()
  data_ingresso: Date;

  @Column()
  data_nasc: Date;

  @Column()
  afastado: boolean;

  @Column()
  regime: string;

  @Column()
  carga_atual: number;

  @Column()
  locacao: string;

  @Column()
  cnome: string;

  @Column()
  data_saida: Date;

  @Column()
  data_exoneracao: Date;

  @Column()
  data_aposentadoria: Date;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;
}

export { Professor };

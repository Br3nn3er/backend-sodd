import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("auditoria_fila")
class AuditoriaFila {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  siape: string;

  @Column()
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

  @Column()
  comando: string;

  @Column()
  stamp: Date;

  @CreateDateColumn()
  created_at: Date;
}

export { AuditoriaFila };

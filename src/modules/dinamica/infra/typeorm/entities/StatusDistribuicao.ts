import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("status_distribuicao")
class StatusDistribuicao {
  @PrimaryGeneratedColumn()
  codigo: string;

  @Column()
  id: number;

  @Column()
  descricao: string;

  @CreateDateColumn()
  created_at: Date;
}

export { StatusDistribuicao };

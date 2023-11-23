import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("etapa")
class Etapa {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  codigo: string;

  @Column()
  ativo: boolean;

  @Column()
  descricao: string;

  @CreateDateColumn()
  created_at: Date;
}

export { Etapa };

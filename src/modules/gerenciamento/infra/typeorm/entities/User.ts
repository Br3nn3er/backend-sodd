import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";

@Entity("usuarios")
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  isAdmin: boolean;

  @Column({
    transformer: {
      from: (value: string) => value?.trim(),
      to: (value: string) => value?.trim(),
    },
  })
  @OneToOne(() => Professor)
  siape: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { User };

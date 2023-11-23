import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Horario } from "../../../../estrutura/infra/typeorm/entities/Horario";
import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";
import { Semana } from "../../../../estrutura/infra/typeorm/entities/Semana";

@Entity("restricoes")
class Restricoes {
  @ManyToOne(() => Professor)
  @JoinColumn({ name: "siape" })
  professor: Professor;

  @PrimaryColumn()
  siape: string;

  @ManyToOne(() => Semana)
  @JoinColumn({ name: "dia" })
  semana: Semana;

  @PrimaryColumn()
  dia: string;

  @ManyToOne(() => Horario)
  @JoinColumn({ name: "letra" })
  letra_H: Horario;

  @PrimaryColumn()
  letra: string;
}

export { Restricoes };

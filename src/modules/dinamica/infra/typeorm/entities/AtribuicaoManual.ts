import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";
import { Turma } from "../../../../estrutura/infra/typeorm/entities/Turma";
import { Cenario } from "./Cenario";

@Entity("atribuicao_manual")
class AtribuicaoManual {
  @ManyToOne(() => Cenario)
  @JoinColumn({ name: "num_cenario" })
  cenario: Cenario;

  @PrimaryColumn()
  num_cenario: number;

  @ManyToOne(() => Professor)
  @JoinColumn({ name: "siape" })
  professor: Professor;

  @Column()
  siape: string;

  @ManyToOne(() => Turma)
  @JoinColumn({ name: "id_turma" })
  turma: Turma;

  @PrimaryColumn()
  id_turma: number;
}

export { AtribuicaoManual };

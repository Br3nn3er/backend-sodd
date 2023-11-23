import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";
import { Cenario } from "./Cenario";

@Entity("distribuicao_carga")
class DistribuicaoCarga {
  @ManyToOne(() => Cenario)
  @JoinColumn({ name: "cenario" })
  cenario_C: Cenario;

  @PrimaryColumn()
  cenario: number;

  @ManyToOne(() => Professor)
  @JoinColumn({ name: "siape" })
  professor: Professor;

  @PrimaryColumn()
  siape: string;

  @PrimaryColumn()
  regra: string;

  @PrimaryColumn()
  carga: number;
}

export { DistribuicaoCarga };

import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAuditoriaFila1635634417497 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "auditoria_fila",
        columns: [
          {
            name: "id",
            type: "bigint",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "siape",
            type: "char",
            length: "8",
            isNullable: false,
          },
          {
            name: "codigo_disc",
            type: "char",
            length: "13",
            isNullable: false,
          },
          {
            name: "pos",
            type: "integer",
            isNullable: false,
          },
          {
            name: "prioridade",
            type: "integer",
            isNullable: false,
          },
          {
            name: "qte_ministrada",
            type: "integer",
            isNullable: false,
          },
          {
            name: "qte_maximo",
            type: "integer",
            isNullable: false,
          },
          {
            name: "ano",
            type: "integer",
            isNullable: false,
          },
          {
            name: "semestre",
            type: "smallint",
            isNullable: false,
          },
          {
            name: "status",
            type: "integer",
            default: -1,
            isNullable: false,
          },
          {
            name: "periodo_preferencial",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "comando",
            type: "char",
            length: "1",
            isNullable: false,
          },
          {
            name: "stamp",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.createPrimaryKey("auditoria_fila", ["id"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("auditoria_fila");
    await queryRunner.dropTable("auditoria_fila");
  }
}

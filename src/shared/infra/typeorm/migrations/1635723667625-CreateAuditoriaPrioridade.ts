import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAuditoriaPrioridade1635723667625
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "auditoria_prioridade",
        columns: [
          {
            name: "id",
            type: "integer",
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
            name: "prioridade_antiga",
            type: "integer",
            isNullable: true,
          },
          {
            name: "prioridade_nova",
            type: "integer",
            isNullable: true,
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

    await queryRunner.createPrimaryKey("auditoria_prioridade", ["id"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("auditoria_prioridade");
    await queryRunner.dropTable("auditoria_prioridade");
  }
}

import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEtapa1635785698510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "etapa",
        columns: [
          {
            name: "id",
            type: "integer",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "codigo",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "ativo",
            type: "boolean",
            default: false,
            isNullable: true,
          },
          {
            name: "descricao",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.createPrimaryKey("etapa", ["id"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("etapa");
    await queryRunner.dropTable("etapa");
  }
}

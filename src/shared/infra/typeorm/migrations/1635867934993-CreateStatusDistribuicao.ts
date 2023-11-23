import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateStatusDistribuicao1635867934993
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "status_distribuicao",
        columns: [
          {
            name: "codigo",
            type: "integer",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "id",
            type: "integer",
            isNullable: false,
          },
          {
            name: "descricao",
            type: "varchar",
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

    await queryRunner.createPrimaryKey("status_distribuicao", ["codigo"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("status_distribuicao");
    await queryRunner.dropTable("status_distribuicao");
  }
}

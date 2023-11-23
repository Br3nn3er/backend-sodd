import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePrioridades1635798864757 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "prioridades",
        columns: [
          {
            name: "id",
            type: "integer",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "prioridade",
            type: "integer",
            isNullable: true,
          },
          {
            name: "codigo_disc",
            type: "varchar",
            length: "13",
            isNullable: false,
          },
          {
            name: "siape",
            type: "char",
            length: "8",
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

    await queryRunner.createPrimaryKey("prioridades", ["id"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("prioridades");
    await queryRunner.dropTable("prioridades");
  }
}

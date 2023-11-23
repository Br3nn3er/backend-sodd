import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSemana1630029377547 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "semana",
        columns: [
          {
            name: "dia",
            type: "char",
            length: "1",
            isNullable: false,
          },
          {
            name: "descricao",
            type: "char",
            length: "13",
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

    await queryRunner.createPrimaryKey("semana", ["dia"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("semana");
    await queryRunner.dropTable("semana");
  }
}

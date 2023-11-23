import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCurso1629829824555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "curso",
        columns: [
          {
            name: "codigo",
            type: "char",
            length: "10",
            isNullable: false,
          },
          {
            name: "nome",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "unidade",
            type: "char",
            length: "5",
            isNullable: false,
          },
          {
            name: "campus",
            type: "varchar",
            length: "6",
            default: "'udi'",
          },
          {
            name: "permitir_choque_periodo",
            type: "boolean",
            isNullable: false,
          },
          {
            name: "permitir_choque_horario",
            type: "boolean",
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

    await queryRunner.createPrimaryKey("curso", ["codigo"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("curso");
    await queryRunner.dropTable("curso");
  }
}

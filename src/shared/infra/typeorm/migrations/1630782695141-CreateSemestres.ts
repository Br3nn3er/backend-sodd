import { MigrationInterface, QueryRunner, Table, TableUnique } from "typeorm";

export class CreateSemestre1629978581031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "semestres",
        columns: [
          {
            name: "id",
            type: "integer",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
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

    const semestresUniqueConstraint = new TableUnique({
      columnNames: ["ano", "semestre"],
    });

    await queryRunner.createUniqueConstraint(
      "semestres",
      semestresUniqueConstraint
    );

    await queryRunner.createPrimaryKey("semestres", ["id"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("semestres");
    await queryRunner.dropTable("semestres");
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateCenario1635887937042 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "cenario",
        columns: [
          {
            name: "num_cenario",
            type: "integer",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "descricao_cenario",
            type: "varchar",
            length: "255",
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
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.createPrimaryKey("cenario", ["num_cenario"]);

    await queryRunner.createForeignKey(
      "cenario",
      new TableForeignKey({
        name: "cenario_semestres_fk",
        columnNames: ["ano", "semestre"],
        referencedColumnNames: ["ano", "semestre"],
        referencedTableName: "semestres",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("cenario", "cenario_semestres_fk");
    await queryRunner.dropPrimaryKey("cenario");
    await queryRunner.dropTable("cenario");
  }
}

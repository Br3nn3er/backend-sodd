import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from "typeorm";

export class CreateTurma1629995830489 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "turma",
        columns: [
          {
            name: "id",
            type: "integer",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "codigo_disc",
            type: "char",
            length: "13",
            isNullable: false,
          },
          {
            name: "turma",
            type: "char",
            length: "2",
            isNullable: false,
          },
          {
            name: "ch",
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
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.createPrimaryKey("turma", ["id"]);

    const categoryUniqueConstraint = new TableUnique({
      columnNames: ["codigo_disc", "turma", "ano", "semestre"],
    });

    await queryRunner.createUniqueConstraint("turma", categoryUniqueConstraint);

    await queryRunner.createForeignKey(
      "turma",
      new TableForeignKey({
        name: "turma_codigo_disc_fkey",
        columnNames: ["codigo_disc"],
        referencedColumnNames: ["codigo"],
        referencedTableName: "disciplina",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("turma", "turma_codigo_disc_fkey");
    await queryRunner.dropPrimaryKey("turma");
    await queryRunner.dropTable("turma");
  }
}

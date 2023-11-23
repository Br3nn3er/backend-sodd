import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateDisciplina1629842575630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "disciplina",
        columns: [
          {
            name: "codigo",
            type: "char",
            isNullable: false,
            length: "13",
          },
          {
            name: "nome",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "ch_teorica",
            type: "integer",
            isNullable: false,
          },
          {
            name: "ch_pratica",
            type: "integer",
            isNullable: false,
          },
          {
            name: "ch_total",
            type: "integer",
            isNullable: false,
          },
          {
            name: "curso",
            type: "char",
            length: "10",
            isNullable: false,
          },
          {
            name: "temfila",
            type: "boolean",
            default: true,
          },
          {
            name: "periodo",
            type: "smallint",
            isNullable: false,
          },
          {
            name: "cod_antigo",
            type: "char",
            length: "13",
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

    await queryRunner.createPrimaryKey("disciplina", ["codigo"]);

    await queryRunner.createForeignKey(
      "disciplina",
      new TableForeignKey({
        name: "disciplina_cod_antigo_fkey",
        columnNames: ["cod_antigo"],
        referencedColumnNames: ["codigo"],
        referencedTableName: "disciplina",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "disciplina",
      new TableForeignKey({
        name: "disciplina_curso_fkey",
        columnNames: ["curso"],
        referencedColumnNames: ["codigo"],
        referencedTableName: "curso",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "disciplina",
      "disciplina_cod_antigo_fkey"
    );

    await queryRunner.dropForeignKey("disciplina", "disciplina_curso_fkey");

    await queryRunner.dropPrimaryKey("disciplina");

    await queryRunner.dropTable("disciplina");
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateCenarioFilaTurma1636196509376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "cenario_fila_turma",
        columns: [
          {
            name: "num_cenario",
            type: "integer",
            isNullable: false,
          },
          {
            name: "id_turma",
            type: "integer",
            isNullable: false,
          },
          {
            name: "id_fila",
            type: "bigint",
            isNullable: false,
          },
          {
            name: "status",
            type: "integer",
            isNullable: true,
          },
          {
            name: "prioridade",
            type: "integer",
            isNullable: false,
          },
          {
            name: "posicao",
            type: "integer",
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

    await queryRunner.createPrimaryKey("cenario_fila_turma", [
      "num_cenario",
      "id_turma",
      "id_fila",
    ]);

    await queryRunner.createForeignKey(
      "cenario_fila_turma",
      new TableForeignKey({
        name: "cenario_fila_turma_cenario_fk",
        columnNames: ["num_cenario"],
        referencedColumnNames: ["num_cenario"],
        referencedTableName: "cenario",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "cenario_fila_turma",
      new TableForeignKey({
        name: "cenario_fila_turma_fila_turma_fk",
        columnNames: ["id_fila", "id_turma"],
        referencedColumnNames: ["id_fila", "id_turma"],
        referencedTableName: "fila_turma_new",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "cenario_fila_turma",
      "cenario_fila_turma_cenario_fk"
    );
    await queryRunner.dropForeignKey(
      "cenario_fila_turma",
      "cenario_fila_turma_fila_turma_fk"
    );
    await queryRunner.dropPrimaryKey("cenario_fila_turma");
    await queryRunner.dropTable("cenario_fila_turma");
  }
}

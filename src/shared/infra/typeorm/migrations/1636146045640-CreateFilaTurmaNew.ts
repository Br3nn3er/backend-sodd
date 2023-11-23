import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateFilaTurmaNew1636146045640 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "fila_turma_new",
        columns: [
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
            name: "prioridade",
            type: "integer",
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

    await queryRunner.createPrimaryKey("fila_turma_new", [
      "id_turma",
      "id_fila",
    ]);

    await queryRunner.createForeignKey(
      "fila_turma_new",
      new TableForeignKey({
        name: "fila_turma_fila_fk",
        columnNames: ["id_fila"],
        referencedColumnNames: ["id"],
        referencedTableName: "fila",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "fila_turma_new",
      new TableForeignKey({
        name: "fila_turma_turma_fk",
        columnNames: ["id_turma"],
        referencedColumnNames: ["id"],
        referencedTableName: "turma",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("fila_turma_new", "fila_turma_fila_fk");
    await queryRunner.dropForeignKey("fila_turma_new", "fila_turma_turma_fk");
    await queryRunner.dropPrimaryKey("fila_turma_new");
    await queryRunner.dropTable("fila_turma_new");
  }
}

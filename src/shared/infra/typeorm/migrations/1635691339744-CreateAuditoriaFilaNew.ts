import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAuditoriaFilaNew1635691339744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "auditoria_fila_turma_new",
        columns: [
          {
            name: "id",
            type: "integer",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
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
            name: "prioridade_old",
            type: "integer",
            isNullable: true,
          },
          {
            name: "prioridade_new",
            type: "integer",
            isNullable: true,
          },
          {
            name: "stamp",
            type: "timestamp",
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

    await queryRunner.createPrimaryKey("auditoria_fila_turma_new", ["id"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("auditoria_fila_turma_new");
    await queryRunner.dropTable("auditoria_fila_turma_new");
  }
}

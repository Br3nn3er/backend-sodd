import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateStatusPossibilidades1636221364682
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "status_possibilidades",
        columns: [
          {
            name: "id_fila",
            type: "integer",
            isNullable: false,
          },
          {
            name: "id_possibilidade",
            type: "integer",
            isNullable: false,
          },
          {
            name: "status",
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

    await queryRunner.createPrimaryKey("status_possibilidades", [
      "id_fila",
      "id_possibilidade",
    ]);

    await queryRunner.createForeignKey(
      "status_possibilidades",
      new TableForeignKey({
        name: "status_possibilidades_fila_fk",
        columnNames: ["id_fila"],
        referencedColumnNames: ["id"],
        referencedTableName: "fila",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "status_possibilidades",
      new TableForeignKey({
        name: "status_possibilidades_possibilidades_fk",
        columnNames: ["id_possibilidade"],
        referencedColumnNames: ["id"],
        referencedTableName: "possibilidades",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "status_possibilidades",
      new TableForeignKey({
        name: "status_possibilidades_status_distribuicao_fk",
        columnNames: ["status"],
        referencedColumnNames: ["id"],
        referencedTableName: "status_distribuicao",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "status_possibilidades",
      "status_possibilidades_fila_fk"
    );
    await queryRunner.dropForeignKey(
      "status_possibilidades",
      "status_possibilidades_possibilidades_fk"
    );
    await queryRunner.dropForeignKey(
      "status_possibilidades",
      "status_possibilidades_status_distribuicao_fk"
    );
    await queryRunner.dropPrimaryKey("status_possibilidades");
    await queryRunner.dropTable("status_possibilidades");
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateRestricoes1636053364363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "restricoes",
        columns: [
          {
            name: "siape",
            type: "char",
            length: "8",
            isNullable: false,
          },
          {
            name: "dia",
            type: "char",
            length: "1",
            isNullable: false,
          },
          {
            name: "letra",
            type: "char",
            length: "1",
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

    await queryRunner.createPrimaryKey("restricoes", ["siape", "dia", "letra"]);

    await queryRunner.createForeignKey(
      "restricoes",
      new TableForeignKey({
        name: "restricoes_dia_fkey",
        columnNames: ["dia"],
        referencedColumnNames: ["dia"],
        referencedTableName: "semana",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "restricoes",
      new TableForeignKey({
        name: "restricoes_letra_fkey",
        columnNames: ["letra"],
        referencedColumnNames: ["letra"],
        referencedTableName: "horario",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "restricoes",
      new TableForeignKey({
        name: "restricoes_siape_fkey",
        columnNames: ["siape"],
        referencedColumnNames: ["siape"],
        referencedTableName: "professor",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("restricoes", "restricoes_siape_fkey");
    await queryRunner.dropForeignKey("restricoes", "restricoes_letra_fkey");
    await queryRunner.dropForeignKey("restricoes", "restricoes_dia_fkey");
    await queryRunner.dropPrimaryKey("restricoes");
    await queryRunner.dropTable("restricoes");
  }
}

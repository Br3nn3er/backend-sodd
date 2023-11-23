import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreatePossibilidades1635944928644 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "possibilidades",
        columns: [
          {
            name: "id",
            type: "integer",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "descricao",
            type: "varchar",
            length: "180",
            isNullable: false,
          },
          {
            name: "num_cenario",
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

    await queryRunner.createPrimaryKey("possibilidades", ["id"]);

    await queryRunner.createForeignKey(
      "possibilidades",
      new TableForeignKey({
        name: "possibilidades_cenarios_fk",
        columnNames: ["num_cenario"],
        referencedColumnNames: ["num_cenario"],
        referencedTableName: "cenario",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("possibilidades");
    await queryRunner.dropForeignKey(
      "possibilidades",
      "possibilidades_cenarios_fk"
    );
    await queryRunner.dropTable("possibilidades");
  }
}

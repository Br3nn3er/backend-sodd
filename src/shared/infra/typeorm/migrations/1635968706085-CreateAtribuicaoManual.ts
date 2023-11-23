import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateAtribuicaoManual1635968706085 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "atribuicao_manual",
        columns: [
          {
            name: "num_cenario",
            type: "integer",
            isNullable: false,
          },
          {
            name: "siape",
            type: "char",
            length: "8",
            isNullable: false,
          },
          {
            name: "id_turma",
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

    await queryRunner.createPrimaryKey("atribuicao_manual", [
      "num_cenario",
      "id_turma",
    ]);

    await queryRunner.createForeignKey(
      "atribuicao_manual",
      new TableForeignKey({
        name: "atribuicao_manual_cenario_fk",
        columnNames: ["num_cenario"],
        referencedColumnNames: ["num_cenario"],
        referencedTableName: "cenario",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "atribuicao_manual",
      new TableForeignKey({
        name: "atribuicao_manual_professor_fk",
        columnNames: ["siape"],
        referencedColumnNames: ["siape"],
        referencedTableName: "professor",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "atribuicao_manual",
      new TableForeignKey({
        name: "atribuicao_manual_turma_fk",
        columnNames: ["id_turma"],
        referencedColumnNames: ["id"],
        referencedTableName: "turma",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "atribuicao_manual",
      "atribuicao_manual_turma_fk"
    );

    await queryRunner.dropForeignKey(
      "atribuicao_manual",
      "atribuicao_manual_professor_fk"
    );

    await queryRunner.dropForeignKey(
      "atribuicao_manual",
      "atribuicao_manual_cenario_fk"
    );

    await queryRunner.dropPrimaryKey("atribuicao_manual");
    await queryRunner.dropTable("atribuicao_manual");
  }
}

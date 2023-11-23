import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateDistribuicoesPossibilidade1636076744582
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "distribuicoes_possibilidade",
        columns: [
          {
            name: "id_possibilidade",
            type: "integer",
            isNullable: false,
          },
          {
            name: "siape",
            type: "character",
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

    await queryRunner.createPrimaryKey("distribuicoes_possibilidade", [
      "id_possibilidade",
      "siape",
      "id_turma",
    ]);

    await queryRunner.createForeignKey(
      "distribuicoes_possibilidade",
      new TableForeignKey({
        name: "distribuicoes_possibilidade_possibilidades_fk",
        columnNames: ["id_possibilidade"],
        referencedColumnNames: ["id"],
        referencedTableName: "possibilidades",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "distribuicoes_possibilidade",
      new TableForeignKey({
        name: "distribuicoes_possibilidade_professor_fk",
        columnNames: ["siape"],
        referencedColumnNames: ["siape"],
        referencedTableName: "professor",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "distribuicoes_possibilidade",
      new TableForeignKey({
        name: "distribuicoes_possibilidade_turma_fk",
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
      "distribuicoes_possibilidade",
      "distribuicoes_possibilidade_turma_fk"
    );
    await queryRunner.dropForeignKey(
      "distribuicoes_possibilidade",
      "distribuicoes_possibilidade_professor_fk"
    );
    await queryRunner.dropForeignKey(
      "distribuicoes_possibilidade",
      "distribuicoes_possibilidade_possibilidades_fk"
    );
    await queryRunner.dropPrimaryKey("distribuicoes_possibilidade");
    await queryRunner.dropTable("distribuicoes_possibilidade");
  }
}

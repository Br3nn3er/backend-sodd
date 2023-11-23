import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateDistribuicaoCarga1636063238625
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "distribuicao_carga",
        columns: [
          {
            name: "cenario",
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
            name: "regra",
            type: "char",
            length: "10",
            isNullable: false,
          },
          {
            name: "carga",
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

    await queryRunner.createPrimaryKey("distribuicao_carga", [
      "cenario",
      "siape",
      "regra",
    ]);

    await queryRunner.createForeignKey(
      "distribuicao_carga",
      new TableForeignKey({
        name: "distr_carga_prof_fk",
        columnNames: ["siape"],
        referencedColumnNames: ["siape"],
        referencedTableName: "professor",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "distribuicao_carga",
      new TableForeignKey({
        name: "distribuicao_carga_cenario_fk",
        columnNames: ["cenario"],
        referencedColumnNames: ["num_cenario"],
        referencedTableName: "cenario",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "distribuicao_carga",
      "distr_carga_prof_fk"
    );
    await queryRunner.dropForeignKey(
      "distribuicao_carga",
      "distribuicao_carga_cenario_fk"
    );
    await queryRunner.dropPrimaryKey("distribuicao_carga");
    await queryRunner.dropTable("distribuicao_carga");
  }
}

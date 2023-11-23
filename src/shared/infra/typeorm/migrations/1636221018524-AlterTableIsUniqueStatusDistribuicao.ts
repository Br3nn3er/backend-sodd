import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableIsUniqueStatusDistribuicao1636221018524
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("status_distribuicao", "id");

    await queryRunner.addColumn(
      "status_distribuicao",
      new TableColumn({
        name: "id",
        type: "integer",
        isNullable: false,
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("status_distribuicao", "id");

    await queryRunner.addColumn(
      "status_distribuicao",
      new TableColumn({
        name: "id",
        type: "integer",
        isNullable: false,
      })
    );
  }
}

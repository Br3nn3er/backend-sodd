import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableMinistraChangePrimaryKey1631281746815
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("ministra");

    await queryRunner.dropColumn("ministra", "id");

    await queryRunner.createPrimaryKey("ministra", ["siape", "id_turma"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("ministra");

    await queryRunner.addColumn(
      "ministra",
      new TableColumn({
        name: "id",
        type: "uuid",
        isPrimary: true,
      })
    );

    await queryRunner.createPrimaryKey("ministra", ["id"]);
  }
}

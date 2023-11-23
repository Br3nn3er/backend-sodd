import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableCargaDocenteChangePrimaryKey1631207525145
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("carga_docente");

    await queryRunner.dropColumn("carga_docente", "id");

    await queryRunner.createPrimaryKey("carga_docente", ["siape"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("carga_docente");

    await queryRunner.addColumn(
      "carga_docente",
      new TableColumn({
        name: "id",
        type: "uuid",
        isPrimary: true,
      })
    );

    await queryRunner.createPrimaryKey("carga_docente", ["id"]);
  }
}

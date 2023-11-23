import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class LigarUsuarioComProfessor1659541099710
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "usuarios",
      new TableColumn({
        length: "8",
        name: "siape",
        type: "char",
        isNullable: true,
        isUnique: false,
      })
    );

    await queryRunner.createForeignKey(
      "usuarios",
      new TableForeignKey({
        name: "usuario_siape_fk",
        columnNames: ["siape"],
        referencedColumnNames: ["siape"],
        referencedTableName: "professor",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("usuarios", "usuario_siape_fk");
    await queryRunner.dropColumn("usuarios", "siape");
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateMinistra1630258332236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "ministra",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
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

    await queryRunner.createForeignKey(
      "ministra",
      new TableForeignKey({
        name: "ministra_siape_fkey",
        columnNames: ["siape"],
        referencedColumnNames: ["siape"],
        referencedTableName: "professor",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "ministra",
      new TableForeignKey({
        name: "ministra_turma_fkey",
        columnNames: ["id_turma"],
        referencedColumnNames: ["id"],
        referencedTableName: "turma",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("ministra", "ministra_turma_fkey");
    await queryRunner.dropForeignKey("ministra", "ministra_siape_fkey");
    await queryRunner.dropTable("ministra");
  }
}

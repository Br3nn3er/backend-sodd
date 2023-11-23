import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateHorario1630070405044 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "horario",
        columns: [
          {
            name: "letra",
            type: "char",
            length: "1",
            isNullable: false,
          },
          {
            name: "hora_inicio",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "hora_fim",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "turno",
            type: "char",
            length: "5",
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

    await queryRunner.createPrimaryKey("horario", ["letra"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("horario");
    await queryRunner.dropTable("horario");
  }
}

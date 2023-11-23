import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProfessor1628703770650 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "professor",
        columns: [
          {
            name: "siape",
            type: "char",
            length: "8",
            isNullable: false,
          },
          {
            name: "nome",
            type: "varchar",
            length: "200",
          },
          {
            name: "data_ingresso",
            type: "date",
            isNullable: false,
          },
          {
            name: "data_nasc",
            type: "date",
            isNullable: false,
          },
          {
            name: "afastado",
            type: "boolean",
            default: false,
          },
          {
            name: "regime",
            type: "varchar",
            length: "3",
            default: "'de'",
          },
          {
            name: "carga_atual",
            type: "int",
            default: 12,
          },
          {
            name: "locacao",
            type: "varchar",
            length: "6",
            default: "'udi'",
          },
          {
            name: "cnome",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "data_saida",
            type: "date",
            isNullable: true,
          },
          {
            name: "data_exoneracao",
            type: "date",
            isNullable: true,
          },
          {
            name: "data_aposentadoria",
            type: "date",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            length: "12",
            default: "'ativo'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.createPrimaryKey("professor", ["siape"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropPrimaryKey("professor");
    await queryRunner.dropTable("professor");
  }
}

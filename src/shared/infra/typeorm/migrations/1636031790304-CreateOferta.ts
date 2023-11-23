import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from "typeorm";

export class CreateOferta1636031790304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "oferta",
        columns: [
          {
            name: "id",
            type: "integer",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "dia",
            type: "char",
            length: "1",
            isNullable: false,
          },
          {
            name: "letra",
            type: "char",
            length: "1",
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

    await queryRunner.createPrimaryKey("oferta", ["id"]);

    const ofertaUniqueConstraint = new TableUnique({
      columnNames: ["dia", "letra", "id_turma"],
    });

    await queryRunner.createUniqueConstraint("oferta", ofertaUniqueConstraint);

    await queryRunner.createForeignKey(
      "oferta",
      new TableForeignKey({
        name: "oferta_dia_fkey",
        columnNames: ["dia"],
        referencedColumnNames: ["dia"],
        referencedTableName: "semana",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "oferta",
      new TableForeignKey({
        name: "oferta_letra_fkey",
        columnNames: ["letra"],
        referencedColumnNames: ["letra"],
        referencedTableName: "horario",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "oferta",
      new TableForeignKey({
        name: "oferta_turma_fkey",
        columnNames: ["id_turma"],
        referencedColumnNames: ["id"],
        referencedTableName: "turma",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("oferta", "oferta_turma_fkey");
    await queryRunner.dropForeignKey("oferta", "oferta_letra_fkey");
    await queryRunner.dropForeignKey("oferta", "oferta_dia_fkey");
    await queryRunner.dropPrimaryKey("oferta");
    await queryRunner.dropTable("oferta");
  }
}

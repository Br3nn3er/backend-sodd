import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from "typeorm";

export class CreateFila1636122729594 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "fila",
        columns: [
          {
            name: "id",
            type: "bigint",
            isNullable: false,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "siape",
            type: "char",
            length: "8",
            isNullable: false,
          },
          {
            name: "codigo_disc",
            type: "char",
            length: "13",
          },
          {
            name: "pos",
            type: "integer",
            isNullable: false,
          },
          {
            name: "prioridade",
            type: "integer",
            isNullable: false,
          },
          {
            name: "qte_ministrada",
            type: "integer",
            isNullable: false,
          },
          {
            name: "qte_maximo",
            type: "integer",
            isNullable: false,
          },
          {
            name: "ano",
            type: "integer",
            isNullable: false,
          },
          {
            name: "semestre",
            type: "smallint",
            isNullable: false,
          },
          {
            name: "status",
            type: "integer",
            default: -1,
            isNullable: false,
          },
          {
            name: "periodo_preferencial",
            type: "boolean",
            default: false,
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

    await queryRunner.createPrimaryKey("fila", ["id"]);

    const fila_codigo_disc_pos_ano_semestre_key = new TableUnique({
      columnNames: ["codigo_disc", "pos", "ano", "semestre"],
    });

    await queryRunner.createUniqueConstraint(
      "fila",
      fila_codigo_disc_pos_ano_semestre_key
    );

    const fila_siape_codigo_disc_ano_semestre_key = new TableUnique({
      columnNames: ["siape", "codigo_disc", "ano", "semestre"],
    });

    await queryRunner.createUniqueConstraint(
      "fila",
      fila_siape_codigo_disc_ano_semestre_key
    );

    await queryRunner.createForeignKey(
      "fila",
      new TableForeignKey({
        name: "fila_codigo_disc_fkey",
        columnNames: ["codigo_disc"],
        referencedColumnNames: ["codigo"],
        referencedTableName: "disciplina",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createForeignKey(
      "fila",
      new TableForeignKey({
        name: "fila_siape_fkey",
        columnNames: ["siape"],
        referencedColumnNames: ["siape"],
        referencedTableName: "professor",
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("fila", "fila_siape_fkey");
    await queryRunner.dropForeignKey("fila", "fila_codigo_disc_fkey");
    await queryRunner.dropPrimaryKey("fila");
    await queryRunner.dropTable("fila");
  }
}

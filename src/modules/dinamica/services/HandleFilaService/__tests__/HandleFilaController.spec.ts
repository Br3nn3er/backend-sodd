import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { DayjsDateProvider } from "../../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Curso } from "../../../../estrutura/infra/typeorm/entities/Curso";
import { Disciplina } from "../../../../estrutura/infra/typeorm/entities/Disciplina";
import { Professor } from "../../../../estrutura/infra/typeorm/entities/Professor";
import { Fila } from "../../../infra/typeorm/entities/Fila";

let connection: Connection;
let dateProvider: DayjsDateProvider;

describe("Handle CRUD routes related to fila", () => {
  beforeAll(async () => {
    dateProvider = new DayjsDateProvider();
    connection = await dataSource.initialize();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO usuarios(id, name, email, password, "isAdmin", created_at)
      values('${id}', 'admin', 'sodd_tcc@outlook.com', '${password}', 'true', 'now()')`
    );

    const curso = new Curso();
    curso.codigo = "BCC";
    curso.nome = "Ciencia da Computacao";
    curso.unidade = "UFU";
    curso.campus = "udi";
    curso.permitir_choque_periodo = false;
    curso.permitir_choque_horario = false;

    await connection.manager.save(curso);

    const disciplina = new Disciplina();
    disciplina.codigo = "BCC011";
    disciplina.nome = "Introdução à Ciencia";
    disciplina.ch_teorica = 4;
    disciplina.ch_pratica = 0;
    disciplina.ch_total = 4;
    disciplina.curso = "BCC";
    disciplina.temfila = true;
    disciplina.periodo = 2;

    const disciplina2 = new Disciplina();
    disciplina2.codigo = "BCC012";
    disciplina2.nome = "Programacao Procedimental";
    disciplina2.ch_teorica = 4;
    disciplina2.ch_pratica = 0;
    disciplina2.ch_total = 4;
    disciplina2.curso = "BCC";
    disciplina2.temfila = true;
    disciplina2.periodo = 2;

    await connection.manager.save(disciplina);
    await connection.manager.save(disciplina2);

    const professor = new Professor();
    professor.siape = "1024300";
    professor.nome = "Oscar Shelton";
    professor.data_ingresso = dateProvider.processDateToUTC(
      new Date("2021-01-25")
    );
    professor.data_nasc = dateProvider.processDateToUTC(new Date("1998-03-23"));
    professor.afastado = true;
    professor.regime = "de";
    professor.carga_atual = 8;
    professor.locacao = "udi";
    professor.cnome = "OShelton";
    professor.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor.status = "ativo";

    await connection.manager.save(professor);

    const professor2 = new Professor();
    professor2.siape = "00100101";
    professor2.nome = "Oscar Shelton";
    professor2.data_ingresso = dateProvider.processDateToUTC(
      new Date("2021-01-25")
    );
    professor2.data_nasc = dateProvider.processDateToUTC(
      new Date("1998-03-23")
    );
    professor2.afastado = true;
    professor2.regime = "de";
    professor2.carga_atual = 8;
    professor2.locacao = "udi";
    professor2.cnome = "OShelton";
    professor2.data_aposentadoria = dateProvider.processDateToUTC(
      new Date("2021-02-05")
    );
    professor2.status = "ativo";

    await connection.manager.save(professor2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new fila record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/fila")
      .send({
        siape: "1024300",
        codigo_disc: "BCC011",
        pos: 30,
        prioridade: 14,
        qte_ministrada: 0,
        qte_maximo: 4,
        ano: 2020,
        semestre: 1,
        status: -1,
        periodo_preferencial: false,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Fila;

    expect(response.status).toBe(201);
    expect(responseResult.siape).toBe("1024300");
  });

  it("Should be able to read all fila records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const fila = new Fila();
    fila.siape = "1024300";
    fila.codigo_disc = "BCC012";
    fila.pos = 15;
    fila.prioridade = 1;
    fila.qte_ministrada = 3;
    fila.qte_maximo = 5;
    fila.ano = 2021;
    fila.semestre = 1;
    fila.status = 1;
    fila.periodo_preferencial = false;

    await connection.manager.save(fila);

    const response = await request(app)
      .get("/fila")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Fila[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to update a fila record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const fila = new Fila();
    fila.siape = "00100101";
    fila.codigo_disc = "BCC012";
    fila.pos = 20;
    fila.prioridade = 2;
    fila.qte_ministrada = 5;
    fila.qte_maximo = 7;
    fila.ano = 2021;
    fila.semestre = 1;
    fila.status = -1;
    fila.periodo_preferencial = false;

    await connection.manager.save(fila);

    const response = await request(app)
      .patch("/fila")
      .send({
        id: 3,
        periodo_preferencial: true,
        semestre: 2,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as Fila;

    expect(response.status).toBe(201);
    expect(responseResult.semestre).toBe(2);
    expect(responseResult.periodo_preferencial).toBe(true);
  });

  it("Should be able to delete a fila record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const fila = new Fila();
    fila.siape = "00100101";
    fila.codigo_disc = "BCC011";
    fila.pos = 15;
    fila.prioridade = 1;
    fila.qte_ministrada = 2;
    fila.qte_maximo = 5;
    fila.ano = 2021;
    fila.semestre = 2;
    fila.status = 1;
    fila.periodo_preferencial = false;

    await connection.manager.save(fila);

    const response = await request(app)
      .delete("/fila/4")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/fila")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const filas = responseGet.body as Fila[];

    const filaDeleted = filas.find((fila) => fila.id === 4);

    expect(response.status).toBe(201);
    expect(filaDeleted).toBeUndefined();
  });
});

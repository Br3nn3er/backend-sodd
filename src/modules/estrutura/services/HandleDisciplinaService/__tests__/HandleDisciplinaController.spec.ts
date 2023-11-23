import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Curso } from "../../../infra/typeorm/entities/Curso";
import { Disciplina } from "../../../infra/typeorm/entities/Disciplina";

let connection: Connection;

describe("Handle CRUD routes related to disciplinas", () => {
  beforeAll(async () => {
    connection = await dataSource.initialize();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO usuarios(id, name, email, password, "isAdmin", created_at)
      values('${id}', 'admin', 'sodd_tcc@outlook.com', '${password}', 'true', 'now()')`
    );

    const curso1 = new Curso();
    curso1.codigo = "BCC";
    curso1.nome = "Ciencia da Computacao";
    curso1.unidade = "UFU";
    curso1.campus = "udi";
    curso1.permitir_choque_periodo = false;
    curso1.permitir_choque_horario = false;

    const curso2 = new Curso();
    curso2.codigo = "BSI";
    curso2.nome = "Sistemas de Informação";
    curso2.unidade = "UFU";
    curso2.campus = "udi";
    curso2.permitir_choque_periodo = false;
    curso2.permitir_choque_horario = false;

    await connection.manager.save(curso1);
    await connection.manager.save(curso2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new disciplina", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/disciplinas")
      .send({
        codigo: "GSI023",
        nome: "Estrutura de Dados",
        ch_teorica: 4,
        ch_pratica: 0,
        ch_total: 4,
        curso: "BSI",
        temfila: true,
        periodo: 2,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Disciplina;

    expect(response.status).toBe(201);
    expect(responseResult.codigo).toBe("GSI023");
    expect(responseResult.periodo).toBe(2);
  });

  it("Should not be able to create an existing disciplina", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/disciplinas")
      .send({
        codigo: "GSI023",
        nome: "Estrutura de Dados",
        ch_teorica: 4,
        ch_pratica: 0,
        ch_total: 4,
        curso: "BSI",
        temfila: true,
        periodo: 2,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Há uma disciplina cadastrada com este codigo!"
    );
  });

  it("Should be able to read all disciplina records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const disciplina = new Disciplina();
    disciplina.codigo = "GSI011";
    disciplina.nome = "Introdução à Sistemas";
    disciplina.ch_teorica = 4;
    disciplina.ch_pratica = 0;
    disciplina.ch_total = 4;
    disciplina.curso = "BSI";
    disciplina.temfila = true;
    disciplina.periodo = 2;

    await connection.manager.save(disciplina);

    const response = await request(app)
      .get("/disciplinas")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Disciplina[];

    expect(response.status).toBe(200);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to read only disciplina record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const disciplina = new Disciplina();
    disciplina.codigo = "GSI222";
    disciplina.nome = "Introdução à Sistemas";
    disciplina.ch_teorica = 4;
    disciplina.ch_pratica = 0;
    disciplina.ch_total = 4;
    disciplina.curso = "BSI";
    disciplina.temfila = true;
    disciplina.periodo = 2;

    await connection.manager.save(disciplina);

    const response = await request(app)
      .get(`/disciplinas/${disciplina.codigo}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Disciplina;

    expect(response.status).toBe(200);
    expect(responseResult.codigo).toStrictEqual(disciplina.codigo);
  });

  it("Should be able to update a disciplina record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const disciplina = new Disciplina();
    disciplina.codigo = "GSI012";
    disciplina.nome = "Profissões";
    disciplina.ch_teorica = 4;
    disciplina.ch_pratica = 0;
    disciplina.ch_total = 4;
    disciplina.curso = "BSI";
    disciplina.temfila = true;
    disciplina.periodo = 2;

    await connection.manager.save(disciplina);

    const response = await request(app)
      .patch("/disciplinas")
      .send({
        codigo: "GSI012",
        nome: "Profissão em Sistemas de Informação",
        ch_pratica: 1,
        ch_teorica: 3,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Disciplina;

    expect(response.status).toBe(200);
    expect(responseResult.nome).toBe("Profissão em Sistemas de Informação");
    expect(responseResult.ch_pratica).toBe(1);
  });

  it("Should not be able to update an unexisting disciplina record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .patch("/disciplinas")
      .send({
        codigo: "43560",
        nome: "Profissão em Sistemas de Informação",
        ch_pratica: 1,
        ch_teorica: 3,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Disciplina não cadastrada!");
  });

  it("Should be able to delete a disciplina record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const disciplina = new Disciplina();
    disciplina.codigo = "BCC012";
    disciplina.nome = "Introdução à Ciencia da Computacao";
    disciplina.ch_teorica = 4;
    disciplina.ch_pratica = 0;
    disciplina.ch_total = 4;
    disciplina.curso = "BCC";
    disciplina.temfila = true;
    disciplina.periodo = 2;

    await connection.manager.save(disciplina);

    const response = await request(app)
      .delete("/disciplinas/GSI012")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/disciplinas")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const disciplinas = responseGet.body as Disciplina[];

    const disciplinaDeleted = disciplinas.find(
      (disciplina) => disciplina.codigo === "GSI012"
    );

    expect(response.status).toBe(200);
    expect(disciplinaDeleted).toBeUndefined();
  });
});

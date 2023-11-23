import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Curso } from "../../../infra/typeorm/entities/Curso";
import { Disciplina } from "../../../infra/typeorm/entities/Disciplina";
import { Turma } from "../../../infra/typeorm/entities/Turma";

let connection: Connection;

describe("Handle CRUD routes related to turma", () => {
  beforeAll(async () => {
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
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new turma record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/turmas")
      .send({
        codigo_disc: "BCC011",
        turma: "S",
        ch: 4,
        ano: 2021,
        semestre: 1,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Turma;

    expect(response.status).toBe(201);
    expect(responseResult.ano).toBe(2021);
    expect(responseResult.codigo_disc).toBe("BCC011");
  });

  it("Should be able to read all turma records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const turma = new Turma();
    turma.codigo_disc = "BCC011";
    turma.turma = "Z";
    turma.ch = 4;
    turma.ano = 2021;
    turma.semestre = 2;

    await connection.manager.save(turma);

    const response = await request(app)
      .get("/turmas")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Turma[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to update a turma record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const turma = new Turma();
    turma.codigo_disc = "BCC011";
    turma.turma = "Z";
    turma.ch = 4;
    turma.ano = 2020;
    turma.semestre = 1;

    await connection.manager.save(turma);

    const response = await request(app)
      .patch("/turmas")
      .send({
        id: 2,
        ch: 5,
        semestre: 2,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Turma;

    expect(response.status).toBe(201);
    expect(responseResult.id).toBe(2);
    expect(responseResult.semestre).toBe(2);
  });

  it("Should be able to delete a turma record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const turma = new Turma();
    turma.codigo_disc = "BCC011";
    turma.turma = "Z";
    turma.ch = 4;
    turma.ano = 2019;
    turma.semestre = 1;

    await connection.manager.save(turma);

    const response = await request(app)
      .delete("/turmas/3")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/turmas")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const turmas = responseGet.body as Turma[];

    const turmaDeleted = turmas.find((turma) => turma.id === "3");

    expect(response.status).toBe(201);
    expect(turmaDeleted).toBeUndefined();
  });
});

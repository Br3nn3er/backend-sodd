import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { AuditoriaFilaNew } from "../../../infra/typeorm/entities/AuditoriaFilaNew";

let connection: Connection;

describe("Handle CRUD routes related to auditoria_fila_turma_new", () => {
  beforeAll(async () => {
    connection = await dataSource.initialize();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO usuarios(id, name, email, password, "isAdmin", created_at)
      values('${id}', 'admin', 'sodd_tcc@outlook.com', '${password}', 'true', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new auditoria_fila_turma_new record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/auditoria_new")
      .send({
        id_turma: 1,
        id_fila: 52,
        prioridade_old: 2,
        prioridade_new: 3,
        stamp: new Date(),
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as AuditoriaFilaNew;

    expect(response.status).toBe(201);
    expect(responseResult.id_turma).toBe(1);
    expect(responseResult.prioridade_new).toBe(3);
  });

  it("Should be able to read all auditoria_fila_turma_new records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const auditoria = new AuditoriaFilaNew();
    auditoria.id_turma = 10;
    auditoria.id_fila = 11;
    auditoria.prioridade_old = 1;
    auditoria.prioridade_new = 10;
    auditoria.stamp = new Date();

    const auditoria2 = new AuditoriaFilaNew();
    auditoria2.id_turma = 11;
    auditoria2.id_fila = 12;
    auditoria2.prioridade_old = 10;
    auditoria2.prioridade_new = 15;
    auditoria2.stamp = new Date();

    await connection.manager.save(auditoria);
    await connection.manager.save(auditoria2);

    const response = await request(app)
      .get("/auditoria_new")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as AuditoriaFilaNew[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(3);
  });

  it("Should be able to update a auditoria_fila_turma_new record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const auditoria = new AuditoriaFilaNew();
    auditoria.id_turma = 55;
    auditoria.id_fila = 30;
    auditoria.prioridade_old = 20;
    auditoria.prioridade_new = 25;
    auditoria.stamp = new Date();

    await connection.manager.save(auditoria);

    const response = await request(app)
      .patch("/auditoria_new")
      .send({
        id: "4",
        id_turma: 60,
        prioridade_new: 30,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as AuditoriaFilaNew;

    expect(response.status).toBe(201);
    expect(responseResult.id).toBe(4);
    expect(responseResult.id_turma).toBe(60);
  });

  it("Should be able to delete a auditoria_fila_turma_new record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const auditoria = new AuditoriaFilaNew();
    auditoria.id_turma = 15;
    auditoria.id_fila = 10;
    auditoria.prioridade_old = 10;
    auditoria.prioridade_new = 15;
    auditoria.stamp = new Date();

    await connection.manager.save(auditoria);

    const response = await request(app)
      .delete("/auditoria_new/5")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/auditoria_new")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const auditorias = responseGet.body as AuditoriaFilaNew[];

    const auditoriaDeleted = auditorias.find(
      (auditoria) => auditoria.id === "5"
    );

    expect(response.status).toBe(201);
    expect(auditoriaDeleted).toBeUndefined();
  });
});

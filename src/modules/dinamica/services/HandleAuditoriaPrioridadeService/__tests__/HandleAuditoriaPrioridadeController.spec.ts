import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { AuditoriaPrioridade } from "../../../infra/typeorm/entities/AuditoriaPrioridade";

let connection: Connection;

describe("Handle CRUD routes related to auditoria_prioridade", () => {
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

  it("Should be able to create a new auditoria_prioridade record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/auditoria_prioridade")
      .send({
        siape: "1111111",
        codigo_disc: "14",
        prioridade_antiga: 1,
        prioridade_nova: 2,
        stamp: new Date(),
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as AuditoriaPrioridade;

    expect(response.status).toBe(201);
    expect(responseResult.prioridade_antiga).toBe(1);
    expect(responseResult.prioridade_nova).toBe(2);
  });

  it("Should be able to read all auditoria_prioridade records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const auditoria = new AuditoriaPrioridade();
    auditoria.siape = "1111111";
    auditoria.codigo_disc = "14";
    auditoria.prioridade_antiga = 1;
    auditoria.prioridade_nova = 2;
    auditoria.stamp = new Date();

    const auditoria2 = new AuditoriaPrioridade();
    auditoria2.siape = "1122111";
    auditoria2.codigo_disc = "GSI001";
    auditoria2.prioridade_antiga = 10;
    auditoria2.prioridade_nova = 22;
    auditoria2.stamp = new Date();

    await connection.manager.save(auditoria);
    await connection.manager.save(auditoria2);

    const response = await request(app)
      .get("/auditoria_prioridade")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as AuditoriaPrioridade[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(3);
  });

  it("Should be able to update a auditoria_prioridade record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const auditoria = new AuditoriaPrioridade();
    auditoria.siape = "1122133";
    auditoria.codigo_disc = "GSI002";
    auditoria.prioridade_antiga = 1;
    auditoria.prioridade_nova = 2;
    auditoria.stamp = new Date();

    await connection.manager.save(auditoria);

    const response = await request(app)
      .patch("/auditoria_prioridade")
      .send({
        id: "4",
        prioridade_antiga: 3,
        prioridade_nova: 4,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as AuditoriaPrioridade;

    expect(response.status).toBe(201);
    expect(responseResult.id).toBe(4);
    expect(responseResult.prioridade_antiga).toBe(3);
  });

  it("Should be able to delete a auditoria_prioridade record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const auditoria = new AuditoriaPrioridade();
    auditoria.siape = "000001";
    auditoria.codigo_disc = "GSI025";
    auditoria.prioridade_antiga = 1;
    auditoria.prioridade_nova = 2;
    auditoria.stamp = new Date();

    await connection.manager.save(auditoria);

    const response = await request(app)
      .delete("/auditoria_prioridade/5")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/auditoria_prioridade")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const auditorias = responseGet.body as AuditoriaPrioridade[];

    const auditoriaDeleted = auditorias.find(
      (auditoria) => auditoria.id === "5"
    );

    expect(response.status).toBe(201);
    expect(auditoriaDeleted).toBeUndefined();
  });
});

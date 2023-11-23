import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { AuditoriaFila } from "../../../infra/typeorm/entities/AuditoriaFila";

let connection: Connection;

describe("Handle CRUD routes related to auditoria_fila", () => {
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

  it("Should be able to create a new auditoria_fila record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/auditoria_fila")
      .send({
        siape: "413286",
        codigo_disc: "FACOM31701",
        pos: 1,
        prioridade: 1,
        qte_ministrada: 1,
        qte_maximo: 6,
        ano: 2021,
        semestre: 1,
        status: -1,
        periodo_preferencial: true,
        comando: "D",
        stamp: new Date(),
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as AuditoriaFila;

    expect(response.status).toBe(201);
    expect(responseResult.periodo_preferencial).toBe(true);
    expect(responseResult.comando).toBe("D");
  });

  it("Should be able to read all auditoria_fila records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const auditoria = new AuditoriaFila();
    auditoria.siape = "0000001";
    auditoria.codigo_disc = "FACOM31701";
    auditoria.pos = 1;
    auditoria.prioridade = 1;
    auditoria.qte_ministrada = 1;
    auditoria.qte_maximo = 6;
    auditoria.ano = 2021;
    auditoria.semestre = 1;
    auditoria.status = -1;
    auditoria.periodo_preferencial = true;
    auditoria.comando = "D";
    auditoria.stamp = new Date();

    const auditoria2 = new AuditoriaFila();
    auditoria2.siape = "0000001";
    auditoria2.codigo_disc = "FACOM31701";
    auditoria2.pos = 1;
    auditoria2.prioridade = 1;
    auditoria2.qte_ministrada = 1;
    auditoria2.qte_maximo = 6;
    auditoria2.ano = 2021;
    auditoria2.semestre = 1;
    auditoria2.status = -1;
    auditoria2.periodo_preferencial = true;
    auditoria2.comando = "D";
    auditoria2.stamp = new Date();

    await connection.manager.save(auditoria);
    await connection.manager.save(auditoria2);

    const response = await request(app)
      .get("/auditoria_fila")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as AuditoriaFila[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(3);
  });

  it("Should be able to update a auditoria_fila record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const auditoria = new AuditoriaFila();
    auditoria.siape = "0000010";
    auditoria.codigo_disc = "FACOM31701";
    auditoria.pos = 1;
    auditoria.prioridade = 1;
    auditoria.qte_ministrada = 1;
    auditoria.qte_maximo = 6;
    auditoria.ano = 2021;
    auditoria.semestre = 1;
    auditoria.status = -1;
    auditoria.periodo_preferencial = true;
    auditoria.comando = "D";
    auditoria.stamp = new Date();

    await connection.manager.save(auditoria);

    const response = await request(app)
      .patch("/auditoria_fila")
      .send({
        id: "4",
        comando: "S",
        periodo_preferencial: false,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as AuditoriaFila;

    expect(response.status).toBe(201);
    expect(responseResult.id).toBe("4");
    expect(responseResult.comando).toBe("S");
  });

  it("Should be able to delete a auditoria_fila record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;
    const auditoria = new AuditoriaFila();
    auditoria.siape = "0000011";
    auditoria.codigo_disc = "FACOM31701";
    auditoria.pos = 1;
    auditoria.prioridade = 1;
    auditoria.qte_ministrada = 1;
    auditoria.qte_maximo = 6;
    auditoria.ano = 2021;
    auditoria.semestre = 1;
    auditoria.status = -1;
    auditoria.periodo_preferencial = true;
    auditoria.comando = "D";
    auditoria.stamp = new Date();

    await connection.manager.save(auditoria);

    const response = await request(app)
      .delete("/auditoria_fila/5")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/auditoria_fila")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const auditorias = responseGet.body as AuditoriaFila[];

    const auditoriaDeleted = auditorias.find(
      (auditoria) => auditoria.id === "5"
    );

    expect(response.status).toBe(201);
    expect(auditoriaDeleted).toBeUndefined();
  });
});

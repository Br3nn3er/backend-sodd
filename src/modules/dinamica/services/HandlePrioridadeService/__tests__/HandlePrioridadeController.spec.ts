import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Prioridades } from "../../../infra/typeorm/entities/Prioridades";

let connection: Connection;

describe("Handle CRUD routes related to prioridades", () => {
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

  it("Should be able to create a new prioridade record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/prioridade")
      .send({
        prioridade: 1,
        codigo_disc: "codigo_001",
        siape: "000001",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Prioridades;

    expect(response.status).toBe(201);
    expect(responseResult.codigo_disc).toBe("codigo_001");
    expect(responseResult.siape).toBe("000001");
  });

  it("Should be able to read all prioridade records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const prioridadeToCreate = new Prioridades();
    prioridadeToCreate.prioridade = 2;
    prioridadeToCreate.codigo_disc = "codigo_002";
    prioridadeToCreate.siape = "000002";

    const prioridadeToCreate2 = new Prioridades();
    prioridadeToCreate2.prioridade = 3;
    prioridadeToCreate2.codigo_disc = "codigo_003";
    prioridadeToCreate2.siape = "000003";

    await connection.manager.save(prioridadeToCreate);
    await connection.manager.save(prioridadeToCreate2);

    const response = await request(app)
      .get("/prioridade")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as Prioridades[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(3);
  });

  it("Should be able to update a prioridade record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const prioridadeToCreate = new Prioridades();
    prioridadeToCreate.prioridade = 4;
    prioridadeToCreate.codigo_disc = "codigo_004";
    prioridadeToCreate.siape = "000004";

    await connection.manager.save(prioridadeToCreate);

    const response = await request(app)
      .patch("/prioridade")
      .send({
        id: "4",
        prioridade: 15,
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as Prioridades;

    expect(response.status).toBe(201);
    expect(responseResult.id).toBe(4);
    expect(responseResult.prioridade).toBe(15);
  });

  it("Should be able to delete a prioridade record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const prioridadeToCreate = new Prioridades();
    prioridadeToCreate.prioridade = 5;
    prioridadeToCreate.codigo_disc = "codigo_005";
    prioridadeToCreate.siape = "000005";

    await connection.manager.save(prioridadeToCreate);

    const response = await request(app)
      .delete("/prioridade/5")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/prioridade")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const listPrioridades = responseGet.body as Prioridades[];

    const prioridadeDeleted = listPrioridades.find(
      (prioridade) => prioridade.id === "5"
    );

    expect(response.status).toBe(201);
    expect(prioridadeDeleted).toBeUndefined();
  });
});

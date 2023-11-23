import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Etapa } from "../../../infra/typeorm/entities/Etapa";

let connection: Connection;

describe("Handle CRUD routes related to etapa", () => {
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

  it("Should be able to create a new etapa record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/etapa")
      .send({
        codigo: "restricoes",
        ativo: true,
        descricao: "Exibir restrições",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Etapa;

    expect(response.status).toBe(201);
    expect(responseResult.ativo).toBe(true);
    expect(responseResult.descricao).toBe("Exibir restrições");
  });

  it("Should be able to read all etapa records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const etapa = new Etapa();
    etapa.codigo = "codigo_01";
    etapa.ativo = true;
    etapa.descricao = "descricao codigo_01";

    const etapa2 = new Etapa();
    etapa2.codigo = "codigo_02";
    etapa2.ativo = true;
    etapa2.descricao = "descricao codigo_02";

    await connection.manager.save(etapa);
    await connection.manager.save(etapa2);

    const response = await request(app)
      .get("/etapa")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as Etapa[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(3);
  });

  it("Should be able to update a etapa record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const etapa = new Etapa();
    etapa.codigo = "codigo_03";
    etapa.ativo = true;
    etapa.descricao = "descricao codigo_03";

    await connection.manager.save(etapa);

    const response = await request(app)
      .patch("/etapa")
      .send({
        id: "4",
        ativo: false,
        descricao: "nova descricao codigo_03",
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as Etapa;

    expect(response.status).toBe(201);
    expect(responseResult.id).toBe(4);
    expect(responseResult.ativo).toBe(false);
  });

  it("Should be able to delete a etapa record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const etapa = new Etapa();
    etapa.codigo = "codigo_04";
    etapa.ativo = true;
    etapa.descricao = "descricao codigo_03";

    await connection.manager.save(etapa);

    const response = await request(app)
      .delete("/etapa/5")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/etapa")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const etapas = responseGet.body as Etapa[];

    const etapaDeleted = etapas.find((etapa) => etapa.id === "5");

    expect(response.status).toBe(201);
    expect(etapaDeleted).toBeUndefined();
  });
});

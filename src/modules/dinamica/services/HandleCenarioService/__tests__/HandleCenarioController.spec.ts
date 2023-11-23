import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Semestre } from "../../../../estrutura/infra/typeorm/entities/Semestre";
import { Cenario } from "../../../infra/typeorm/entities/Cenario";

let connection: Connection;

describe("Handle CRUD routes related to cenario", () => {
  beforeAll(async () => {
    connection = await dataSource.initialize();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO usuarios(id, name, email, password, "isAdmin", created_at)
      values('${id}', 'admin', 'sodd_tcc@outlook.com', '${password}', 'true', 'now()')`
    );

    const semestre1 = new Semestre();
    semestre1.ano = 2021;
    semestre1.semestre = 1;
    semestre1.status = false;

    const semestre2 = new Semestre();
    semestre2.ano = 2021;
    semestre2.semestre = 2;
    semestre2.status = true;

    await connection.manager.save(semestre1);
    await connection.manager.save(semestre2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new cenario", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/cenario")
      .send({
        descricao_cenario: "Calculo I",
        ano: 2021,
        semestre: 1,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Cenario;

    expect(response.status).toBe(201);
    expect(responseResult.semestre).toBe(1);
    expect(responseResult.descricao_cenario).toBe("Calculo I");
  });

  it("Should be able to read all cenario records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const cenario = new Cenario();
    cenario.descricao_cenario = "a description";
    cenario.ano = 2021;
    cenario.semestre = 1;

    await connection.manager.save(cenario);

    const response = await request(app)
      .get("/cenario")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Cenario[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to update a cenario record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const cenario = new Cenario();
    cenario.descricao_cenario = "another description";
    cenario.ano = 2021;
    cenario.semestre = 2;

    await connection.manager.save(cenario);

    const response = await request(app)
      .patch("/cenario")
      .send({
        num_cenario: "3",
        descricao_cenario: "new cenario",
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as Cenario;

    expect(response.status).toBe(201);
    expect(responseResult.num_cenario).toBe(3);
    expect(responseResult.descricao_cenario).toBe("new cenario");
  });

  it("Should be able to delete a cenario record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const cenario = new Cenario();
    cenario.descricao_cenario = "a new description";
    cenario.ano = 2021;
    cenario.semestre = 2;

    await connection.manager.save(cenario);

    const response = await request(app)
      .delete("/cenario/4")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/cenario")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const cenarios = responseGet.body as Cenario[];

    const cenarioDeleted = cenarios.find(
      (cenario) => cenario.num_cenario === "5"
    );

    expect(response.status).toBe(201);
    expect(cenarioDeleted).toBeUndefined();
  });
});

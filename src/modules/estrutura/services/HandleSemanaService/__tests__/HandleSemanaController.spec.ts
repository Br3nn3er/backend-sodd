import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Semana } from "../../../infra/typeorm/entities/Semana";

let connection: Connection;

describe("Handle CRUD routes related to semana", () => {
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

  it("Should be able to create a new semana", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/semanas")
      .send({
        dia: "0",
        descricao: "Domingo",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("Should be able to list semanas records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const semana = new Semana();
    semana.dia = "1";
    semana.descricao = "Segunda-feira";

    await connection.manager.save(semana);

    const response = await request(app)
      .get("/semanas")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body.length).toBe(2);
  });

  it("Should be able to update an semana record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const semana = new Semana();
    semana.dia = "1";
    semana.descricao = "Segunda-feira";

    await connection.manager.save(semana);

    const response = await request(app)
      .patch("/semanas")
      .send({
        dia: "0",
        descricao: "Desc Test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const semanaResponse = response.body as Semana;

    expect(response.status).toBe(201);
    expect(semanaResponse.dia).toBe("0");
    expect(semanaResponse.descricao).toBe("Desc Test");
  });

  it("Should be able to delete a semana record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const semana = new Semana();
    semana.dia = "2";
    semana.descricao = "Terca-feira";

    await connection.manager.save(semana);

    const responseDelete = await request(app)
      .delete("/semanas/2")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/semanas")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const semanas = responseGet.body as Semana[];

    const foundedDeletedSemana = semanas.find((semana) => semana.dia === "2");

    expect(responseDelete.status).toBe(201);
    expect(foundedDeletedSemana).toBeUndefined();
  });
});

import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Semestre } from "../../../infra/typeorm/entities/Semestre";

let connection: Connection;

describe("Handle CRUD routes related to semestre", () => {
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

  it("Should be able to create a new semestre record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/semestres")
      .send({
        ano: "2020",
        semestre: "1",
        status: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Semestre;

    expect(response.status).toBe(201);
    expect(responseResult.ano).toBe("2020");
    expect(responseResult.status).toBe(true);
  });

  it("Should not be able to create an existing semestre record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/semestres")
      .send({
        ano: "2020",
        semestre: "1",
        status: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Já existe um ano com este semestre!");
  });

  it("Should be able to read all semestres records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/semestres")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Semestre[];

    expect(response.status).toBe(200);
    expect(responseResult).toHaveLength(1);
  });

  it("Should be able to read only semestre record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const semestre1 = new Semestre();
    semestre1.ano = 2030;
    semestre1.semestre = 1;
    semestre1.status = true;

    const semestre2 = new Semestre();
    semestre2.ano = 2031;
    semestre2.semestre = 2;
    semestre2.status = true;

    const [semesterInDataBase] = await connection.manager.save([
      semestre1,
      semestre2,
    ]);

    const response = await request(app)
      .get(`/semestres/${semestre1.id}`)
      .send()
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.id).toStrictEqual(semesterInDataBase.id);
  });

  it("Should be able to update a semestre record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const semestre = new Semestre();
    semestre.ano = 2021;
    semestre.semestre = 1;
    semestre.status = false;

    await connection.manager.save(semestre);

    const response = await request(app)
      .patch("/semestres")
      .send({
        id: 2,
        status: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Semestre;

    expect(response.status).toBe(200);
    expect(responseResult.id).toBe(2);
    expect(responseResult.status).toBe(true);
  });

  it("Should not be able to update an unexisting semestre record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .patch("/semestres")
      .send({
        id: 500,
        status: true,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Registro não consta no sistema!");
  });

  it("Should be able to delete a semestre record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const semestre = new Semestre();
    semestre.ano = 2021;
    semestre.semestre = 2;
    semestre.status = true;

    await connection.manager.save(semestre);

    const response = await request(app)
      .delete("/semestres/3")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/semestres")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const semestres = responseGet.body as Semestre[];

    const semestreDeleted = semestres.find((semestre) => semestre.id === 3);

    expect(response.status).toBe(200);
    expect(semestreDeleted).toBeUndefined();
  });
});

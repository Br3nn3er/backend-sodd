import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Semestre } from "../../../../estrutura/infra/typeorm/entities/Semestre";
import { Cenario } from "../../../infra/typeorm/entities/Cenario";
import { Possibilidades } from "../../../infra/typeorm/entities/Possibilidades";

let connection: Connection;

describe("Handle CRUD routes related to possibilidades", () => {
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

    const cenario1 = new Cenario();
    cenario1.descricao_cenario = "description_001";
    cenario1.ano = 2021;
    cenario1.semestre = 1;

    const cenario2 = new Cenario();
    cenario2.descricao_cenario = "description_002";
    cenario2.ano = 2021;
    cenario2.semestre = 2;

    await connection.manager.save(semestre1);
    await connection.manager.save(semestre2);

    await connection.manager.save(cenario1);
    await connection.manager.save(cenario2);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new possibilidade", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/possibilidade")
      .send({
        num_cenario: 1,
        descricao: "description_001",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Possibilidades;

    expect(response.status).toBe(201);
    expect(responseResult.num_cenario).toBe(1);
    expect(responseResult.descricao).toBe("description_001");
  });

  it("Should be able to read all possibilidade records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const possibilidades = new Possibilidades();
    possibilidades.num_cenario = 2;
    possibilidades.descricao = "description_001";

    await connection.manager.save(possibilidades);

    const response = await request(app)
      .get("/possibilidade")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Cenario[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to update a possibilidade record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const possibilidades = new Possibilidades();
    possibilidades.num_cenario = 1;
    possibilidades.descricao = "description_003";

    await connection.manager.save(possibilidades);

    const response = await request(app)
      .patch("/possibilidade")
      .send({
        id: "3",
        descricao: "new description",
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as Possibilidades;

    expect(response.status).toBe(201);
    expect(responseResult.descricao).toBe("new description");
  });

  it("Should be able to delete a possibilidades record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const possibilidades = new Possibilidades();
    possibilidades.num_cenario = 2;
    possibilidades.descricao = "description_004";

    await connection.manager.save(possibilidades);

    const response = await request(app)
      .delete("/possibilidade/4")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/possibilidade")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const possibilidadess = responseGet.body as Possibilidades[];

    const possibilidadesDeleted = possibilidadess.find(
      (possibilidades) => possibilidades.id === "4"
    );

    expect(response.status).toBe(201);
    expect(possibilidadesDeleted).toBeUndefined();
  });
});

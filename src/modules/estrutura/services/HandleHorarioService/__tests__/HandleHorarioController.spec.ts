import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { Horario } from "../../../infra/typeorm/entities/Horario";

let connection: Connection;

describe("Handle CRUD routes related to horario", () => {
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

  it("Should be able to create a new horario", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/horarios")
      .send({
        letra: "w",
        hora_inicio: "08:50:00",
        hora_fim: "09:40:00",
        turno: "MANHÃ",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Horario;

    expect(response.status).toBe(201);
    expect(responseResult.hora_inicio).toBe("08:50:00");
    expect(responseResult.hora_fim).toBe("09:40:00");
  });

  it("Should be able to read all horario records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const horario = new Horario();
    horario.letra = "a";
    horario.hora_inicio = "08:50:00";
    horario.hora_fim = "10:40:00";
    horario.turno = "MANHÃ";

    await connection.manager.save(horario);

    const response = await request(app)
      .get("/horarios")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Horario[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(2);
  });

  it("Should be able to update a horario record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const horario = new Horario();
    horario.letra = "b";
    horario.hora_inicio = "14:50:00";
    horario.hora_fim = "16:50:00";
    horario.turno = "MANHÃ";

    await connection.manager.save(horario);

    const response = await request(app)
      .patch("/horarios")
      .send({
        letra: "b",
        turno: "TARDE",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as Horario;

    expect(response.status).toBe(201);
    expect(responseResult.letra).toBe("b");
    expect(responseResult.turno).toBe("TARDE");
  });

  it("Should be able to delete a horario record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const horario = new Horario();
    horario.letra = "c";
    horario.hora_inicio = "16:50:00";
    horario.hora_fim = "18:10:00";
    horario.turno = "TARDE";

    await connection.manager.save(horario);

    const response = await request(app)
      .delete("/horarios/c")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseGet = await request(app)
      .get("/horarios")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const horarios = responseGet.body as Horario[];

    const horarioDeleted = horarios.find((horario) => horario.letra === "c");

    expect(response.status).toBe(201);
    expect(horarioDeleted).toBeUndefined();
  });
});

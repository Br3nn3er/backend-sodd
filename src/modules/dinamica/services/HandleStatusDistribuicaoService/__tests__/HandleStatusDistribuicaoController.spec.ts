import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../../shared/infra/http/app";
import { dataSource } from "../../../../../shared/infra/typeorm";
import { StatusDistribuicao } from "../../../infra/typeorm/entities/StatusDistribuicao";

let connection: Connection;

describe("Handle CRUD routes related to status_distribuicao", () => {
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

  it("Should be able to create a new status_distribuicao record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/status")
      .send({
        id: 1,
        descricao: "description_001",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseResult = response.body as StatusDistribuicao;

    expect(response.status).toBe(201);
    expect(responseResult.id).toBe(1);
    expect(responseResult.descricao).toBe("description_001");
  });

  it("Should be able to read all status_distribuicao records", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const status = new StatusDistribuicao();
    status.id = 2;
    status.descricao = "description_002";

    const status2 = new StatusDistribuicao();
    status2.id = 3;
    status2.descricao = "description_003";

    await connection.manager.save(status);
    await connection.manager.save(status2);

    const response = await request(app)
      .get("/status")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as StatusDistribuicao[];

    expect(response.status).toBe(201);
    expect(responseResult).toHaveLength(3);
  });

  it("Should be able to update a status_distribuicao record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const status = new StatusDistribuicao();
    status.id = 4;
    status.descricao = "description_004";

    await connection.manager.save(status);

    const response = await request(app)
      .patch("/status")
      .send({
        id: 5,
        descricao: "new description_004",
      })
      .set({ Authorization: `Bearer ${token}` });

    const responseResult = response.body as StatusDistribuicao;

    expect(response.status).toBe(201);
    expect(responseResult.id).toBe(5);
    expect(responseResult.descricao).toBe("new description_004");
  });

  it("Should be able to delete a status_distribuicao record", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: "sodd_tcc@outlook.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const status = new StatusDistribuicao();
    status.id = 10;
    status.descricao = "description_005";

    await connection.manager.save(status);

    const response = await request(app)
      .delete("/status/5")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    const responseGet = await request(app)
      .get("/status")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    const listStatus = responseGet.body as StatusDistribuicao[];

    const statusDeleted = listStatus.find((status) => status.codigo === "5");

    expect(response.status).toBe(201);
    expect(statusDeleted).toBeUndefined();
  });
});
